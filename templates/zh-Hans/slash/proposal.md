**护栏**
- 优先采用直接、最小化的实现，仅在明确要求或确实需要时才增加复杂性。
- 保持更改严格限定在请求的结果范围内。
- 如果需要其他 OpenSpec 约定或澄清，请参阅 `openspec/AGENTS.md`（位于 `openspec/` 目录内——如果看不到，请运行 `ls openspec` 或 `openspec update`）。
- 识别任何模糊或歧义的细节，在编辑文件之前提出必要的跟进问题。
- 不要在提案阶段编写任何代码。仅创建设计文档（proposal.md、tasks.md、design.md 和规范增量）。实施发生在批准后的应用阶段。

**步骤**
1. 查看 `openspec/project.md`，运行 `openspec list` 和 `openspec list --specs`，并检查相关代码或文档（例如通过 `rg`/`ls`）以使提案基于当前行为；注意需要澄清的任何差距。
2. 选择唯一的动词开头 `change-id`，并在 `openspec/changes/<id>/` 下搭建 `proposal.md`、`tasks.md` 和（需要时）`design.md`。
3. 将变更映射到具体的能力或需求，将多范围工作分解为具有清晰关系和顺序的不同规范增量。
4. 当解决方案跨越多个系统、引入新模式或在承诺规范之前需要权衡讨论时，在 `design.md` 中记录架构推理。
5. 在 `changes/<id>/specs/<capability>/spec.md`（每个能力一个文件夹）中使用 `## ADDED|MODIFIED|REMOVED Requirements` 编写规范增量，每个需求至少包含一个 `#### Scenario:`，并在相关时交叉引用相关能力。
6. 将 `tasks.md` 编写为小的、可验证的工作项的有序列表，提供用户可见的进展，包括验证（测试、工具），并突出显示依赖关系或可并行化的工作。
7. 使用 `openspec validate <id> --strict` 进行验证，并在分享提案前解决每个问题。

**参考**
- 使用 `openspec show <id> --json --deltas-only` 或 `openspec show <spec> --type spec` 在验证失败时检查详情。
- 在编写新需求之前，使用 `rg -n "Requirement:|Scenario:" openspec/specs` 搜索现有需求。
- 使用 `rg <keyword>`、`ls` 或直接文件读取来探索代码库，使提案与当前实现现实保持一致。
