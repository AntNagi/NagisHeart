# 开源聊天客户端接入

**不自研聊天前端**（D6）。从 GitHub 选成熟项目，经 OpenAI-compatible API 接入。
本目录只放：选型记录、配置、主题、必要的薄适配。

## 选型标准（V4 §11.1，七条须全满足）

1. 许可证允许部署和必要修改
2. 支持自定义 OpenAI-compatible Base URL
3. 支持流式回复与 BYOK
4. 移动端可用
5. 无需把 Nagi Resources / system prompt / 服务端代码打进前端
6. 最好可纯配置接入，避免维护长期 fork
7. 仍有维护活动，依赖与安全更新没有明显停滞

## ⚠ 选型有失败风险，建议先做 spike

七条全满足的项目未必存在，且选型决定鉴权与 BYOK 的传递方式、牵动 API 契约。

**建议 8/22 花半天确认「确实存在这样一个客户端」**，不必完成配置，只需确认可行性。
若拖到 8/27 才发现选不到，8/28 的接入与 Demo 会连带失守（V4 §15 排期备注）。

> Ant 定按实际完成情况推进，故未硬改排期。此处仅记录风险。

## 已知体验代价

两段流（Guard 过了才发）意味着**普通客户端只收到最终回复**，
progress 事件对使用者不可见 —— 发出消息后会空白若干秒再整段出现。

**8/25 必须实测首字延迟并记录**：≲3s 不动；≳6s 再评估混合流（V4 §6.1）。

## 选定：Chatbox Lite

- 项目：[lfbear/chatbox-lite](https://github.com/lfbear/chatbox-lite)
- 形态：单 HTML + 可选 PWA companion files，适合本地 Demo 与移动端安装
- 许可证：MIT（以仓库当前 LICENSE 为准，2026-08-21 检查）
- 接入方式：选择 OpenAI-compatible provider，Base URL 指向 Nagi `/v1`，模型名填 `configured`
- 流式：客户端支持 SSE；Nagi 已提供 `/v1/chat/completions` SSE
- BYOK：客户端本地保存并随 `X-LLM-Key` 透传；服务端不落库、不写日志
- 必要适配：Nagi 已补 CORS preflight 与 `authorization` / `x-llm-key` 允许头
- 安全边界：不得把 `resources/`、system prompt 或服务端源码复制到客户端

固定 commit 尚未能从 GitHub 网络取回；接入前必须锁定具体 commit 并复核 LICENSE。
