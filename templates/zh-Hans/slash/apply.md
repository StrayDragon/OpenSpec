**护栏**
- 优先采用直接、最小化的实现，仅在明确要求或确实需要时才增加复杂性。
- 保持更改严格限定在请求的结果范围内。
- 如果需要其他 OpenSpec 约定或澄清，请参阅 `openspec/AGENTS.md`（位于 `openspec/` 目录内——如果看不到，请运行 `ls openspec` 或 `openspec update`）。

**步骤**
将这些步骤跟踪为 TODO 并逐一完成。
1. 阅读 `changes/<id>/proposal.md`、`design.md`（如果存在）和 `tasks.md` 以确认范围和验收标准。
2. 依次完成任务，保持编辑最小化并专注于请求的更改。
3. 在更新状态前确认完成——确保 `tasks.md` 中的每个项目都已完成。
4. 在所有工作完成后更新检查清单，使每个任务标记为 `- [x]` 并反映实际情况。
5. 当需要额外上下文时，参考 `openspec list` 或 `openspec show <item>`。

**参考**
- 如果在实施过程中需要来自提案的额外上下文，使用 `openspec show <id> --json --deltas-only`。
