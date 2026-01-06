**约束**
- 优先采用直接、最小化的方案，只有在明确要求或确有必要时才增加复杂度。
- 变更范围紧扣所请求的结果。
- 如需更多 OpenSpec 约定或澄清，请参考 `openspec/AGENTS.md`（位于 `openspec/` 目录内；如未看到可运行 `ls openspec` 或 `openspec update`）。

**步骤**
1. 确定要归档的变更 ID：
   - 如果该提示已包含具体的变更 ID（例如位于由斜杠命令参数填充的 `<ChangeId>` 块中），请去除首尾空白后使用该值。
   - 如果对话仅模糊提到某个变更（例如按标题或摘要），运行 `openspec list` 找出可能的 ID，给出候选并确认用户意图。
   - 否则，回顾对话并运行 `openspec list`，询问用户要归档哪个变更；在得到确认的变更 ID 前不要继续。
   - 如果仍无法确定唯一的变更 ID，停止并告知目前无法归档。
2. 运行 `openspec list`（或 `openspec show <id>`）验证变更 ID，如果不存在、已归档或未准备好归档则停止。
3. 运行 `openspec archive <id> --yes`，让 CLI 无提示地移动变更并应用规格更新（仅在工具性变更时使用 `--skip-specs`）。
4. 查看命令输出，确认目标规格已更新且变更已进入 `changes/archive/`。
5. 运行 `openspec validate --strict` 验证，如有异常用 `openspec show <id>` 检查。

**参考**
- 使用 `openspec list` 在归档前确认变更 ID。
- 用 `openspec list --specs` 检查更新后的规格，并在交接前处理任何验证问题。
