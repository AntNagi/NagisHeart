#!/usr/bin/env python3
"""
风格锚逐字保真校验。

style_anchor 是唯一允许 `derivation: extract`（逐字）的资源类型——
改写会失去风格，锚就不成其为锚。既然逐字，就必须能证明它确实逐字。

本脚本断言：style_anchors/ 里引用的每一句「你：」「凪：」
都在 V17 原文中逐字存在。任一句对不上即失败。

配合 validate-resources.py 的 SHA 比对，构成双重保障：
    SHA 变了     → V17 被改过，强制重新派生
    逐字对不上   → 锚被手改过或抄错

退出码：0 全部命中；1 有偏差。
"""
import sys, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPO = ROOT.parent
V17 = REPO / "authority/script/Nagis_Heart_SCRIPT_V17_RelationshipFriction_Calibrated.md"


def main():
    if not V17.exists():
        print(f"找不到 V17: {V17}"); return 1
    lines = V17.read_text(encoding="utf-8").splitlines()
    nagi = {m.group(1).strip() for l in lines
            if (m := re.match(r"^Nagi[:：]\s*(.+)$", l))}
    player = {m.group(1).strip() for l in lines
              if (m := re.match(r"^\{\{playerName\}\}[:：]\s*(.+)$", l))}

    tot = ok = 0
    bad = []
    for f in sorted((ROOT / "resources/style_anchors").glob("*.md")):
        body = f.read_text(encoding="utf-8").split("---", 2)[2]
        for m in re.finditer(r"^(你|凪)：(.+)$", body, re.M):
            who, text = m.group(1), m.group(2).strip()
            pool = nagi if who == "凪" else player
            tot += 1
            if text in pool:
                ok += 1
            else:
                bad.append((f.name, who, text))

    if not tot:
        print("style_anchors/ 下没有可校验的引文"); return 0

    for name, who, text in bad:
        print(f"FAIL  {name}  {who}：{text}")
    print(f"\n逐字保真: {ok}/{tot}")
    if bad:
        print(f"*** {len(bad)} 句未在 V17 中逐字命中，构建应失败 ***")
        return 1
    print("全部命中 V17 原文")
    return 0


if __name__ == "__main__":
    sys.exit(main())
