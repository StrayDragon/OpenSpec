**护栏**
- 优先采用直接、最小化的实现，仅在明确要求或确实需要时才增加复杂性。
- 保持更改严格限定在请求的结果范围内。
- 如果需要其他 OpenSpec 约定或澄清，请参阅 `openspec/AGENTS.md`（位于 `openspec/` 目录内——如果看不到，请运行 `ls openspec` 或 `openspec update`）。

**步骤**
1. 确定要归档的变更 ID：
   - 如果此提示已经包含特定的变更 ID（例如，在由斜杠命令参数填充的 `<ChangeId>` 块内），请在修剪空白后使用该值。
   - 如果对话松散地引用了变更（例如通过标题或摘要），运行 `openspec list` 以显示可能的候选者，分享相关候选者，并确认用户打算归档哪个。
   - 否则，检查对话，运行 `openspec list`，并询问用户要归档哪个变更；在继续之前等待确认的变更 ID。
   - 如果仍然无法识别单个变更 ID，停止并告诉用户目前无法归档任何内容。
2. 通过运行 `openspec list`（或 `openspec show <id>`）验证变更 ID，如果变更缺失、已归档或尚未准备好归档，则停止。
3. 运行 `openspec archive <id> --yes`，以便 CLI 移动变更并应用规范更新而不提示（仅对纯工具工作使用 `--skip-specs`）。
4. 查看命令输出以确认目标规范已更新，变更已落入 `changes/archive/`。
5. 使用 `openspec validate --strict` 进行验证，如果任何内容看起来不对，使用 `openspec show <id>` 进行检查。

**参考**
- 使用 `openspec list` 在归档前确认变更 ID。
- 使用 `openspec list --specs` 检查刷新的规范，并在交接前解决任何验证问题。
