**约束**
- 优先采用直接、最小化的方案，只有在明确要求或确有必要时才增加复杂度。
- 变更范围紧扣所请求的结果。
- 如需更多 OpenSpec 约定或澄清，请参考 `openspec/AGENTS.md`（位于 `openspec/` 目录内；如未看到可运行 `ls openspec` 或 `openspec update`）。
- 发现含糊或不清晰的细节时，在编辑文件前提出必要的追问。
- 提案阶段不要编写任何代码。只创建设计文档（proposal.md、tasks.md、design.md 以及规格增量）。实现工作在通过批准后的 apply 阶段进行。

**步骤**
1. 复查 `openspec/project.md`，运行 `openspec list` 和 `openspec list --specs`，并检查相关代码或文档（例如使用 `rg`/`ls`），让提案基于当前行为；记录需要澄清的缺口。
2. 选择唯一的动词开头 `change-id`，在 `openspec/changes/<id>/` 下生成 `proposal.md`、`tasks.md`，以及需要时的 `design.md`。
3. 将变更映射为明确的能力或需求，把多范围工作拆成相互关联且有顺序的规格增量。
4. 当方案跨越多个系统、引入新模式或需要在定案前讨论权衡时，在 `design.md` 中记录架构理由。
5. 在 `changes/<id>/specs/<capability>/spec.md` 中起草规格增量（每个能力一个文件夹），使用 `## ADDED|MODIFIED|REMOVED Requirements`，并确保每条需求至少包含一个 `#### Scenario:`，相关能力之间要交叉引用。
6. 将 `tasks.md` 写成有序的小型可验证工作项，体现用户可见进展，包含验证（测试、工具），并标出依赖或可并行项。
7. 运行 `openspec validate <id> --strict` 验证，在分享提案前修复所有问题。

**参考**
- 当验证失败需要更多上下文时，使用 `openspec show <id> --json --deltas-only` 或 `openspec show <spec> --type spec` 查看细节。
- 在编写新需求前，先用 `rg -n "Requirement:|Scenario:" openspec/specs` 搜索现有需求。
- 使用 `rg <keyword>`、`ls` 或直接读取文件来熟悉代码库，使提案与当前实现相符。
