# One-Time Startup For Ant

Ant老板只需要把下面这句话分别丢给开发 Claude、测试 Claude、设计协作者一次。

```md
从现在开始不要等我转发。请读取 `D:\Nagi‘s Heart\PM_AGENT_INBOX` 中对应你的 bootstrap 文件，并按文件要求把结果写回 `D:\Nagi‘s Heart\PM_AGENT_OUTBOX`。PM 一一会自动巡检 outbox 并继续推进。
```

如果对方工具支持持续工作或 watch 模式，请再补一句：

```md
后续请持续检查 `PM_AGENT_INBOX` 是否有新的任务单；完成后统一写入 `PM_AGENT_OUTBOX`，不要把结论只留在聊天里。
```
