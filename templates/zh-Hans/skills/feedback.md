帮助用户提交关于 OpenSpec 的反馈。

**目标**：引导用户收集、补充并提交反馈，同时通过匿名化确保隐私。

**流程**

1. **从对话中收集上下文**
   - 回顾最近的对话历史以获取上下文
   - 确认正在进行的任务
   - 记录哪些做得好或不好
   - 捕捉具体摩擦点或表扬

2. **撰写增强后的反馈**
   - 创建清晰、描述性的标题（单句，不需要 "Feedback:" 前缀）
   - 编写正文，包含：
     - 用户想做什么
     - 发生了什么（好或坏）
     - 对话中的相关上下文
     - 具体建议或请求

3. **匿名化敏感信息**
   - 将文件路径替换为 `<path>` 或通用描述
   - 将 API key、token、secret 替换为 `<redacted>`
   - 将公司/组织名称替换为 `<company>`
   - 将个人姓名替换为 `<user>`
   - 将特定 URL 替换为 `<url>`（除非公开/相关）
   - 保留有助于理解问题的技术细节

4. **提交前展示草稿**
   - 向用户展示完整草稿
   - 清晰显示标题和正文
   - 在提交前请求明确批准
   - 允许用户请求修改

5. **确认后提交**
   - 使用 `openspec feedback` 命令提交
   - 格式：`openspec feedback "title" --body "body content"`
   - 命令会自动添加元数据（版本、平台、时间戳）

**示例草稿**

```
Title: Error handling in artifact workflow needs improvement

Body:
我在创建新的变更时遇到了一些问题。
在创建 proposal 之后继续操作时，系统没有清楚提示
我需要先完成 specs。

Suggestion: 增加更清晰的错误提示，解释工件依赖关系。
例如："Cannot create design.md because specs are not complete (0/2 done)."

Context: Using the spec-driven schema with <path>/my-project
```

**匿名化示例**

Before:
```
Working on /Users/john/mycompany/auth-service/src/oauth.ts
Failed with API key: sk_live_abc123xyz
Working at Acme Corp
```

After:
```
Working on <path>/oauth.ts
Failed with API key: <redacted>
Working at <company>
```

**护栏**

- 必须在提交前展示完整草稿
- 必须请求明确批准
- 必须匿名化敏感信息
- 允许用户在提交前修改草稿
- 未经用户确认不得提交
- 应包含相关技术上下文
- 保留对话中的关键信息

**需要用户确认**

始终询问：
```
这是我整理的反馈草稿：

Title: [title]

Body:
[body]

看起来可以吗？如果需要我可以修改，或者按当前内容提交。
```

只有在用户确认后才继续提交。
