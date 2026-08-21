#!/usr/bin/env python3
"""
资源校验器 —— V4 §8.2「构建期先跑一遍，格式错、哈希失配直接构建失败」。

⚠️ 临时实现。正式版应移植到 TypeScript 随 npm run build 执行（V4 §12 scripts/）。
   保留 Python 版是为了在 Node 依赖装好之前就能守住资源质量。

用法：
    python scripts/validate-resources.py            # 校验
    python scripts/validate-resources.py --budget   # 附预算汇总

退出码：0 通过；1 有资源不达标（CI 应据此失败）。
"""
import sys, re, hashlib, pathlib, argparse

try:
    import yaml
except ImportError:
    print("需要 pyyaml：python -m pip install pyyaml"); sys.exit(1)

ROOT = pathlib.Path(__file__).resolve().parent.parent
REQUIRED = {"id", "kind", "version", "source", "activation"}
KINDS = {"personality", "speech", "behavior_rule", "timeline", "event",
         "relationship", "skill", "policy", "style_anchor"}
# derivation 禁止 verbatim_copy —— 红线：不得复制权威内容（DEC-20260820-001）
DERIVATIONS = {"structured_rewrite", "extract", "computed"}


def sha256(p: pathlib.Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest().upper()


def check(path: pathlib.Path):
    """返回 (errors, warnings, info)"""
    errs, warns = [], []
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return ["无 front-matter"], [], {}
    try:
        _, fm_raw, body = text.split("---", 2)
        fm = yaml.safe_load(fm_raw)
    except Exception as e:
        return [f"front-matter 解析失败: {e}"], [], {}

    missing = REQUIRED - set(fm or {})
    if missing:
        errs.append(f"缺字段 {sorted(missing)}")

    if fm.get("kind") not in KINDS:
        errs.append(f"kind 非法: {fm.get('kind')}")

    # source 可回溯 + 哈希未失配（V4 §8.1）
    for s in (fm.get("source") or []):
        if not isinstance(s, dict):
            errs.append("source 条目必须是对象"); continue
        if not s.get("section"):
            errs.append(f"source 缺 section 坐标: {s.get('path')}")
        d = s.get("derivation")
        if d not in DERIVATIONS:
            errs.append(f"derivation 非法: {d}（禁止 verbatim_copy）")
        sp = s.get("path")
        if sp:
            f = ROOT / sp
            if not f.exists():
                errs.append(f"source 文件不存在: {sp}")
            elif s.get("sha256"):
                actual = sha256(f)
                if actual != s["sha256"].upper():
                    errs.append(f"源文件哈希失配，须重新派生: {sp}\n"
                                f"      登记 {s['sha256'][:16]}… / 实际 {actual[:16]}…")

    act = fm.get("activation") or {}
    # 「没有 activation 条件的资源不许存在」——它会永远常驻，吃预算
    if not any(k in act for k in ("always", "scenes", "when", "context", "consumers")):
        errs.append("activation 未声明任何激活条件")

    # 代码块完整性：奇数个 ``` 说明有块被吞（bash 未加引号的 heredoc 会导致）
    if body.count("```") % 2:
        errs.append("代码块未配对")
    empty = len(re.findall(r"```[a-z]*\s*\n\s*```", body))
    if empty:
        errs.append(f"{empty} 个空代码块（内容疑似丢失）")

    # 预算（估算系数为【推断】，待 8/23 用 countTokens 标定）
    cjk = sum(1 for c in body if "\u4e00" <= c <= "\u9fff")
    est = int(cjk * 1.1) + int((len(body) - cjk) * 0.28)
    budget = act.get("token_budget")
    if budget and est > budget:
        errs.append(f"超预算 ~{est}/{budget}")
    elif budget and est > budget * 0.9:
        warns.append(f"接近预算上限 ~{est}/{budget}")

    return errs, warns, {"id": fm.get("id"), "kind": fm.get("kind"),
                         "est": est, "budget": budget, "act": act}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--budget", action="store_true")
    args = ap.parse_args()

    files = sorted((ROOT / "resources").rglob("*.md"))
    # 排除非资源文件：
    #   MANIFEST.md            —— 清单本身
    #   NagisHeart_*_Bible_*   —— 四份母版，是**素材**不是派生资源，无 front-matter 属正常
    # 结构待改：素材应移入 resources/_sources/ 与派生物分开（OPEN_QUESTIONS Q18）。
    # 暂不移动——Nagi Bible 路径已登记进 decision_log DEC-20260820-001 与
    # authority/MANIFEST.md，移动须同步改登记，需 Ant 裁决。
    def is_source_material(f):
        return f.name == "MANIFEST.md" or (
            f.name.startswith("NagisHeart_") and "_Bible_" in f.name)

    sources = [f for f in files if is_source_material(f)]
    files = [f for f in files if not is_source_material(f)]

    n_err = 0
    always_total = 0
    for f in files:
        errs, warns, info = check(f)
        rel = f.relative_to(ROOT)
        if errs:
            n_err += 1
            print(f"FAIL  {rel}")
            for e in errs:
                print(f"      - {e}")
        else:
            extra = f"  ~{info['est']} tok" if info.get("est") else ""
            print(f"OK    {rel}{extra}")
            for w in warns:
                print(f"      ! {w}")
        if info.get("act", {}).get("always") and info.get("budget"):
            always_total += info["budget"]

    if sources:
        print()
        print("跳过 %d 份素材（母版，非派生资源）:" % len(sources))
        for f in sources:
            print("      - %s" % f.relative_to(ROOT))

    if args.budget:
        print(f"\n常驻（always）预算合计: {always_total} tok")

    print()
    if n_err:
        print(f"*** {n_err} 份资源不达标，构建应失败 ***")
        return 1
    print(f"全部通过（{len(files)} 份）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
