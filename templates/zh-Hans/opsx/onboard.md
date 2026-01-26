引导用户完成第一次完整的 OpenSpec 工作流周期。这是一次教学体验——你会在他们的代码库里做真实工作，同时解释每一步。

---

## 预检

开始前，检查 OpenSpec 是否已初始化：

```bash
openspec status --json 2>&1 || echo "NOT_INITIALIZED"
```

**如果未初始化：**
> 该项目尚未设置 OpenSpec。请先运行 `openspec init`，然后再回到 `/opsx:onboard`。

未初始化时在此停止。

---

## 阶段 1：欢迎

显示：

```
## 欢迎使用 OpenSpec！

我将带你完成一次完整的变更周期——从想法到实现——使用你代码库中的真实任务。过程中你会通过实践学习工作流。

**我们将做：**
1. 选择一个小而真实的代码库任务
2. 简要探索问题
3. 创建变更（我们的工作容器）
4. 生成工件：proposal -> specs -> design -> tasks
5. 实施任务
6. 归档已完成的变更

**时间：**约 15-20 分钟

让我们先找个小任务开始。
```

---

## 阶段 2：选择任务

### 代码库分析

扫描代码库中的小改进机会。关注：

1. **TODO/FIXME 注释** - 在代码中搜索 `TODO`、`FIXME`、`HACK`、`XXX`
2. **缺失的错误处理** - 吞掉错误的 `catch` 块、缺少 try-catch 的风险操作
3. **缺少测试的函数** - 对照 `src/` 和测试目录
4. **类型问题** - TypeScript 中的 `any`（`: any`、`as any`）
5. **调试遗留** - 非调试代码中的 `console.log`、`console.debug`、`debugger`
6. **缺少校验** - 用户输入处理缺少验证

也查看最近的 git 活动：
```bash
git log --oneline -10 2>/dev/null || echo "No git history"
```

### 给出建议

根据分析给出 3-4 个具体建议：

```
## 任务建议

基于对代码库的扫描，以下是一些适合的入门任务：

**1. [最有希望的任务]**
   位置：`src/path/to/file.ts:42`
   范围：约 1-2 个文件，20-30 行
   为什么合适：[简要原因]

**2. [第二个任务]**
   位置：`src/another/file.ts`
   范围：约 1 个文件，15 行
   为什么合适：[简要原因]

**3. [第三个任务]**
   位置：[位置]
   范围：[估计]
   为什么合适：[简要原因]

**4. 其他？**
   告诉我你想做什么。

你对哪个任务感兴趣？（选一个编号或描述你自己的想法）
```

**如果没有找到：** 回退到询问用户想构建什么：
> 我没有在你的代码库中发现明显的小改进点。你最近有什么小功能或小修复想做吗？

### 范围护栏

如果用户选择或描述了过大的任务（大型功能、多天工作）：

```
这是个很有价值的任务，但它可能不太适合作为你的第一次 OpenSpec 流程练习。

为了学习流程，任务越小越好 - 这样你能完整体验一次流程，而不会卡在实现细节上。

**选项：**
1. **拆小一些** - [该任务] 最小可用的一块是什么？也许先做 [具体切片]？
2. **换一个任务** - 选择其他建议，或一个新的小任务
3. **直接做** - 如果你真的想做，我们也可以，但会更久

你更倾向于哪一种？
```

如果用户坚持，让他们覆盖选择——这是一个软护栏。

---

## 阶段 3：探索演示

选定任务后，简要演示探索模式：

```
在创建变更之前，我先快速演示一下 **探索模式** - 它用于在提交方向之前思考问题。
```

用 1-2 分钟调查相关代码：
- 阅读相关文件
- 如有帮助，画一个 ASCII 图
- 记录关键考虑点

```
## 快速探索

[你的简要分析 - 发现了什么，关键考虑]

+-----------------------------------------+
|   [如有需要，可放 ASCII 图]              |
+-----------------------------------------+

探索模式（`/opsx:explore`）就是用于这种思考——在实现前先调查。你可以在需要思考问题时随时使用它。

现在我们创建一个变更来承载这项工作。
```

**暂停** - 等待用户确认后继续。

---

## 阶段 4：创建变更

**EXPLAIN：**
```
## 创建变更

OpenSpec 中的 "变更" 是围绕一项工作的思考与规划容器。它位于 `openspec/changes/<name>/`，包含 proposal、specs、design、tasks 等工件。

让我为这个任务创建一个变更。
```

**DO：** 使用派生出的 kebab-case 名称创建变更：
```bash
openspec new change "<derived-name>"
```

**SHOW：**
```
已创建：`openspec/changes/<name>/`

目录结构：
```
openspec/changes/<name>/
├── proposal.md    <- 为什么要做（空的，稍后填写）
├── design.md      <- 如何实现（空的）
├── specs/         <- 详细需求（空的）
└── tasks.md       <- 实现检查清单（空的）
```

现在我们填写第一个工件：proposal。
```

---

## 阶段 5：Proposal

**EXPLAIN：**
```
## Proposal

Proposal 记录我们 **为什么** 要做这件事，以及高层次 **会改变什么**。它是这项工作的电梯陈述。

我会基于这个任务起草一份。
```

**DO：** 起草 proposal 内容（先不保存）：

```
这里是一份草案：

---

## Why

[1-2 句描述问题/机会]

## What Changes

[会发生什么变化的要点]

## Capabilities

### New Capabilities
- `<capability-name>`: [简要说明]

### Modified Capabilities
<!-- 如果修改现有行为 -->

## Impact

- `src/path/to/file.ts`: [会发生什么变化]
- [其他文件]

---

这是否准确表达了意图？需要的话我可以先调整再保存。
```

**暂停** - 等待用户批准/反馈。

批准后，保存 proposal：
```bash
openspec instructions proposal --change "<name>" --json
```
然后将内容写入 `openspec/changes/<name>/proposal.md`。

```
Proposal 已保存。这是你的 "why" 文档——之后可以随时回来调整。

接下来：specs。
```

---

## 阶段 6：Specs

**EXPLAIN：**
```
## Specs

Specs 用精确、可测试的方式定义 **我们要做什么**。它采用 requirement/scenario 格式，让期望行为清晰可测。

对于小任务，可能只需要一个 spec 文件。
```

**DO：** 创建 spec 文件：
```bash
mkdir -p openspec/changes/<name>/specs/<capability-name>
```

起草 spec 内容：

```
这是 spec：

---

## ADDED Requirements

### Requirement: <Name>

<系统应该做什么的描述>

#### Scenario: <Scenario name>

- **WHEN** <触发条件>
- **THEN** <期望结果>
- **AND** <需要补充的结果>

---

这种 WHEN/THEN/AND 格式让需求可测试。你几乎可以直接把它当作测试用例来读。
```

保存到 `openspec/changes/<name>/specs/<capability>/spec.md`。

---

## 阶段 7：Design

**EXPLAIN：**
```
## Design

Design 记录 **我们如何实现**——技术决策、权衡、方案。

小变更可以很简短。没关系，并不是每个变更都需要深入设计。
```

**DO：** 起草 design.md：

```
这是 design：

---

## Context

[当前状态的简要背景]

## Goals / Non-Goals

**Goals：**
- [我们要达成的目标]

**Non-Goals：**
- [明确不做的内容]

## Decisions

### Decision 1: [关键决策]

[方案与理由说明]

---

对于小任务，这样就能覆盖关键决策而不过度设计。
```

保存到 `openspec/changes/<name>/design.md`。

---

## 阶段 8：Tasks

**EXPLAIN：**
```
## Tasks

最后，我们把工作拆成实现任务 - 这些复选框驱动 apply 阶段。

任务应当清晰、可执行、顺序合理。
```

**DO：** 根据 specs 和 design 生成任务：

```
下面是实现任务：

---

## 1. [类别或文件]

- [ ] 1.1 [具体任务]
- [ ] 1.2 [具体任务]

## 2. 验证

- [ ] 2.1 [验证步骤]

---

每个复选框就是 apply 阶段的工作单元。准备好开始实现了吗？
```

**暂停** - 等待用户确认他们准备开始实现。

保存到 `openspec/changes/<name>/tasks.md`。

---

## 阶段 9：Apply（实现）

**EXPLAIN：**
```
## Implementation

现在我们逐项实现任务，并逐步勾选完成。我会宣布每个任务，并适当说明它如何与 specs/design 对应。
```

**DO：** 对每个任务执行：

1. 宣布：“正在处理任务 N：[描述]”
2. 在代码库中实现变更
3. 自然引用 specs/design：“规范写的是 X，所以我这样做 Y”
4. 在 tasks.md 中标记完成：`- [ ]` -> `- [x]`
5. 简短状态：“OK Task N complete”

保持讲解轻量 - 不要逐行过度解释。

完成所有任务后：

```
## Implementation Complete

所有任务完成：
- [x] 任务 1
- [x] 任务 2
- [x] ...

变更已实现！最后一步 - 归档它。
```

---

## 阶段 10：Archive

**EXPLAIN：**
```
## Archiving

当变更完成后，我们将其归档。从 `openspec/changes/` 移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`。

归档后的变更成为项目的决策历史 - 你可以随时回顾它为什么这样实现。
```

**DO：**
```bash
openspec archive "<name>"
```

**SHOW：**
```
归档至：`openspec/changes/archive/YYYY-MM-DD-<name>/`

该变更已成为项目历史的一部分。代码在你的代码库中，决策记录也被保留。
```

---

## 阶段 11：回顾与下一步

```
## 恭喜！

你刚完成一次完整的 OpenSpec 周期：

1. **Explore** - 思考问题
2. **New** - 创建变更容器
3. **Proposal** - 记录 WHY
4. **Specs** - 详细定义 WHAT
5. **Design** - 决定 HOW
6. **Tasks** - 拆分实现步骤
7. **Apply** - 实现工作
8. **Archive** - 保留记录

同样的节奏适用于任何规模的变更 - 小修复或大功能。

---

## 命令参考

| Command | What it does |
|---------|--------------|
| `/opsx:explore` | Think through problems before/during work |
| `/opsx:new` | Start a new change, step through artifacts |
| `/opsx:ff` | Fast-forward: create all artifacts at once |
| `/opsx:continue` | Continue working on an existing change |
| `/opsx:apply` | Implement tasks from a change |
| `/opsx:verify` | Verify implementation matches artifacts |
| `/opsx:archive` | Archive a completed change |

---

## 下一步？

试试在真正想做的事情上使用 `/opsx:new` 或 `/opsx:ff`。你已经掌握节奏了！
```

---

## 退出处理

### 用户中途想停下来

如果用户表示要停止、暂停或看起来不投入：

```
没问题！你的变更保存在 `openspec/changes/<name>/`。

以后继续：
- `/opsx:continue <name>` - 继续创建工件
- `/opsx:apply <name>` - 直接进入实现（如果已有 tasks）

工作不会丢失。随时回来继续。
```

保持礼貌，不要施压。

### 用户只想要命令参考

如果用户说只想看命令或跳过教程：

```
## OpenSpec 快速参考

| Command | What it does |
|---------|--------------|
| `/opsx:explore` | Think through problems (no code changes) |
| `/opsx:new <name>` | Start a new change, step by step |
| `/opsx:ff <name>` | Fast-forward: all artifacts at once |
| `/opsx:continue <name>` | Continue an existing change |
| `/opsx:apply` | Implement tasks |
| `/opsx:verify <name>` | Verify implementation |
| `/opsx:archive <name>` | Archive when done |

试试 `/opsx:new` 来开始你的第一个变更，或用 `/opsx:ff` 加速。
```

礼貌结束。

---

## 护栏

- **遵循 EXPLAIN -> DO -> SHOW -> PAUSE 模式**（在探索、proposal 草稿、tasks、归档等关键节点）
- **实现阶段保持轻量讲解** - 教学而不说教
- **不要跳过阶段**，即使是小变更 - 目标是教流程
- **在标记点暂停确认**，但不要过度暂停
- **优雅退出** - 不要给用户压力
- **使用真实代码库任务** - 不要模拟或使用假例子
- **温和调整范围** - 引导更小范围但尊重用户选择
