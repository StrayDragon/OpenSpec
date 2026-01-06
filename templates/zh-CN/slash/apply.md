**约束**
- 优先采用直接、最小化的方案，只有在明确要求或确有必要时才增加复杂度。
- 变更范围紧扣所请求的结果。
- 如需更多 OpenSpec 约定或澄清，请参考 `openspec/AGENTS.md`（位于 `openspec/` 目录内；如未看到可运行 `ls openspec` 或 `openspec update`）。

**步骤**
将这些步骤作为 TODO 跟踪，逐项完成。
1. 阅读 `changes/<id>/proposal.md`、`design.md`（如存在）以及 `tasks.md`，确认范围和验收标准。
2. 按顺序完成任务，保持改动最小并聚焦于请求的变更。
3. 更新状态前先确认完成情况，确保 `tasks.md` 中每一项都已完成。
4. 所有工作完成后更新清单，将每个任务标记为 `- [x]` 并反映实际完成情况。
5. 需要更多上下文时，参考 `openspec list` 或 `openspec show <item>`。

**参考**
- 实现过程中需要更多提案上下文时，使用 `openspec show <id> --json --deltas-only`。
