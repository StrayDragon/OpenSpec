# OpenSpec 指南

面向使用 OpenSpec 进行规格驱动开发的 AI 编程助手的指引。

## TL;DR 快速清单

- 查看现有工作: `openspec spec list --long`, `openspec list`（仅在全文搜索时使用 `rg`）
- 确定范围: 新能力 vs 修改现有能力
- 选择唯一的 `change-id`: kebab-case，动词开头（`add-`、`update-`、`remove-`、`refactor-`）
- 搭建脚手架: `proposal.md`、`tasks.md`、`design.md`（仅在需要时），以及每个受影响能力的增量规格
- 编写增量: 使用 `## ADDED|MODIFIED|REMOVED|RENAMED Requirements`；每个需求至少包含一个 `#### Scenario:`
- 验证: `openspec validate [change-id] --strict` 并修复问题
- 申请批准: 提案通过前不要开始实现

## 三阶段流程

### 阶段 1: 创建变更
需要创建提案的情况：
- 添加功能或能力
- 进行破坏性变更（API、schema）
- 更改架构或模式
- 优化性能（会改变行为）
- 更新安全模式

触发词（示例）：
- "帮我创建一个变更提案"
- "帮我规划一个变更"
- "帮我创建一个提案"
- "我想创建一个规格提案"
- "我想创建一个规格"

宽松匹配指引：
- 包含其一: `proposal`, `change`, `spec`
- 再包含其一: `create`, `plan`, `make`, `start`, `help`

以下情况跳过提案：
- 修复 bug（恢复预期行为）
- 拼写、格式、注释
- 依赖更新（非破坏性）
- 配置变更
- 对现有行为的测试

**流程**
1. 查看 `openspec/project.md`、`openspec list` 和 `openspec list --specs` 以了解当前上下文。
2. 选择唯一的动词开头 `change-id`，在 `openspec/changes/<id>/` 下生成 `proposal.md`、`tasks.md`、可选的 `design.md` 以及规格增量。
3. 使用 `## ADDED|MODIFIED|REMOVED Requirements` 起草规格增量，每条需求至少包含一个 `#### Scenario:`。
4. 运行 `openspec validate <id> --strict` 并在分享提案前解决所有问题。

### 阶段 2: 实现变更
将这些步骤作为 TODO 跟踪，逐项完成。
1. **阅读 proposal.md** - 了解要构建的内容
2. **阅读 design.md**（如存在）- 复核技术决策
3. **阅读 tasks.md** - 获取实现清单
4. **按顺序实现任务** - 依次完成
5. **确认完成** - 在更新状态前确保 `tasks.md` 中每一项已完成
6. **更新清单** - 完成所有工作后，将每项任务标记为 `- [x]` 以反映实际完成情况
7. **批准门槛** - 提案审阅通过前不要开始实现

### 阶段 3: 归档变更
部署后，创建单独的 PR 来：
- 将 `changes/[name]/` → `changes/archive/YYYY-MM-DD-[name]/`
- 如能力发生变更，更新 `specs/`
- 仅工具性变更使用 `openspec archive <change-id> --skip-specs --yes`（始终显式传入变更 ID）
- 运行 `openspec validate --strict` 确认归档后的变更通过检查

## 任何任务之前

**上下文清单：**
- [ ] 阅读 `specs/[capability]/spec.md` 中的相关规格
- [ ] 检查 `changes/` 中是否有冲突的未完成变更
- [ ] 阅读 `openspec/project.md` 了解约定
- [ ] 运行 `openspec list` 查看进行中的变更
- [ ] 运行 `openspec list --specs` 查看现有能力

**在创建规格之前：**
- 始终检查能力是否已存在
- 优先修改现有规格而不是创建重复项
- 使用 `openspec show [spec]` 查看当前状态
- 如请求含糊，在脚手架前先问 1-2 个澄清问题

### 搜索指引
- 列出规格: `openspec spec list --long`（脚本可用 `--json`）
- 列出变更: `openspec list`（或 `openspec change list --json` - 已弃用但可用）
- 查看详情:
  - 规格: `openspec show <spec-id> --type spec`（过滤可用 `--json`）
  - 变更: `openspec show <change-id> --json --deltas-only`
- 全文搜索（使用 ripgrep）: `rg -n "Requirement:|Scenario:" openspec/specs`

## 快速开始

### CLI 命令

```bash
# 核心命令
openspec list                  # 列出进行中的变更
openspec list --specs          # 列出规格
openspec show [item]           # 显示变更或规格
openspec validate [item]       # 验证变更或规格
openspec archive <change-id> [--yes|-y]   # 部署后归档（非交互运行请加 --yes）

# 项目管理
openspec init [path]           # 初始化 OpenSpec
openspec update [path]         # 更新指令文件

# 交互模式
openspec show                  # 提示选择
openspec validate              # 批量验证模式

# 调试
openspec show [change] --json --deltas-only
openspec validate [change] --strict
```

### 命令参数

- `--json` - 机器可读输出
- `--type change|spec` - 消除歧义
- `--strict` - 全面验证
- `--no-interactive` - 禁用提示
- `--skip-specs` - 归档时不更新规格
- `--yes`/`-y` - 跳过确认提示（非交互归档）

## 目录结构

```
openspec/
├── project.md              # 项目约定
├── specs/                  # 当前真相 - 已构建内容
│   └── [capability]/       # 单一聚焦能力
│       ├── spec.md         # 需求和场景
│       └── design.md       # 技术模式
├── changes/                # 提案 - 将要变更的内容
│   ├── [change-name]/
│   │   ├── proposal.md     # 为什么、做什么、影响
│   │   ├── tasks.md        # 实现清单
│   │   ├── design.md       # 技术决策（可选，见条件）
│   │   └── specs/          # 规格增量
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 已完成变更
```

## 创建变更提案

### 决策树

```
新请求?
├─ 修复 bug，恢复规格行为? → 直接修复
├─ 拼写/格式/注释? → 直接修复
├─ 新功能/能力? → 创建提案
├─ 破坏性变更? → 创建提案
├─ 架构变更? → 创建提案
└─ 不明确? → 创建提案（更安全）
```

### 提案结构

1. **创建目录：** `changes/[change-id]/`（kebab-case，动词开头，唯一）

2. **编写 proposal.md：**
```markdown
## 为什么
[1-2 句描述问题/机会]

## 变更内容
- [变更列表]
- [用 **BREAKING** 标记破坏性变更]

## 影响
- 受影响的规格: [能力列表]
- 受影响的代码: [关键文件/系统]
```

3. **创建规格增量：** `specs/[capability]/spec.md`
```markdown
## ADDED Requirements
### Requirement: New Feature
The system SHALL provide...

#### Scenario: Success case
- **WHEN** user performs action
- **THEN** expected result

## MODIFIED Requirements
### Requirement: Existing Feature
[Complete modified requirement]

## REMOVED Requirements
### Requirement: Old Feature
**Reason**: [Why removing]
**Migration**: [How to handle]
```
如果影响多个能力，在 `changes/[change-id]/specs/<capability>/spec.md` 下创建多个增量文件——每个能力一个。

4. **创建 tasks.md：**
```markdown
## 1. Implementation
- [ ] 1.1 Create database schema
- [ ] 1.2 Implement API endpoint
- [ ] 1.3 Add frontend component
- [ ] 1.4 Write tests
```

5. **需要时创建 design.md：**
若满足以下任一条件，创建 `design.md`，否则省略：
- 跨领域变更（多个服务/模块）或新的架构模式
- 新的外部依赖或显著的数据模型变更
- 安全、性能或迁移复杂度
- 在编码前需要技术决策来消除歧义

最小 `design.md` 骨架：
```markdown
## 背景
[背景、约束、干系人]

## 目标 / 非目标
- 目标: [...]
- 非目标: [...]

## 决策
- 决策: [内容与原因]
- 备选方案: [选项 + 理由]

## 风险 / 权衡
- [风险] → 缓解措施

## 迁移计划
[步骤、回滚]

## 未决问题
- [...]
```

## 规格文件格式

### 关键：场景格式

**正确**（使用 #### 标题）：
```markdown
#### Scenario: User login success
- **WHEN** valid credentials provided
- **THEN** return JWT token
```

**错误**（不要用 bullets 或 bold）：
```markdown
- **Scenario: User login**  ❌
**Scenario**: User login     ❌
### Scenario: User login      ❌
```

每条需求必须至少包含一个场景。

### 需求措辞
- 使用 SHALL/MUST 作为规范性需求（除非有意非规范，不使用 should/may）

### 增量操作

- `## ADDED Requirements` - 新能力
- `## MODIFIED Requirements` - 变更行为
- `## REMOVED Requirements` - 弃用能力
- `## RENAMED Requirements` - 仅名称变化

标题使用 `trim(header)` 匹配 - 忽略空白。

#### 何时使用 ADDED vs MODIFIED
- ADDED: 引入可以独立成立的新能力或子能力。若变更与已有能力正交（例如新增 "Slash Command Configuration"），优先使用 ADDED。
- MODIFIED: 变更已有需求的行为、范围或验收标准。始终粘贴完整更新后的需求内容（标题 + 全部场景）。归档器会用你提供的内容替换整段需求；部分增量会导致细节丢失。
- RENAMED: 仅名称变化时使用。如果还改变了行为，使用 RENAMED（名称）+ MODIFIED（内容），并引用新名称。

常见陷阱：使用 MODIFIED 增加新关注点但未包含旧内容，会导致归档时细节丢失。如果没有明确改变既有行为，请用 ADDED 新增需求。

正确编写 MODIFIED 需求：
1) 在 `openspec/specs/<capability>/spec.md` 中找到现有需求。
2) 复制整个需求块（从 `### Requirement:` 到所有场景）。
3) 粘贴到 `## MODIFIED Requirements` 下，并按新行为修改。
4) 确保标题文本完全一致（忽略空白）且至少包含一个 `#### Scenario:`。

RENAMED 示例：
```markdown
## RENAMED Requirements
- FROM: `### Requirement: Login`
- TO: `### Requirement: User Authentication`
```

## 故障排查

### 常见错误

**"Change must have at least one delta"**
- 检查 `changes/[name]/specs/` 是否存在 .md 文件
- 确认文件包含操作前缀（## ADDED Requirements）

**"Requirement must have at least one scenario"**
- 检查场景使用 `#### Scenario:` 格式（4 个 #）
- 不要用 bullet 或加粗来标注场景

**Silent scenario parsing failures**
- 必须精确格式：`#### Scenario: Name`
- 可用 `openspec show [change] --json --deltas-only` 调试

### 验证提示

```bash
# 始终使用 strict 模式进行全面检查
openspec validate [change] --strict

# 调试增量解析
openspec show [change] --json | jq '.deltas'

# 检查指定需求
openspec show [spec] --json -r 1
```

## 顺畅路径脚本

```bash
# 1) 探索当前状态
openspec spec list --long
openspec list
# 可选全文搜索:
# rg -n "Requirement:|Scenario:" openspec/specs
# rg -n "^#|Requirement:" openspec/changes

# 2) 选择 change id 并搭建脚手架
CHANGE=add-two-factor-auth
mkdir -p openspec/changes/$CHANGE/{specs/auth}
printf "## 为什么\n...\n\n## 变更内容\n- ...\n\n## 影响\n- ...\n" > openspec/changes/$CHANGE/proposal.md
printf "## 1. Implementation\n- [ ] 1.1 ...\n" > openspec/changes/$CHANGE/tasks.md

# 3) 添加增量（示例）
cat > openspec/changes/$CHANGE/specs/auth/spec.md << 'EOF'
## ADDED Requirements
### Requirement: Two-Factor Authentication
Users MUST provide a second factor during login.

#### Scenario: OTP required
- **WHEN** valid credentials are provided
- **THEN** an OTP challenge is required
EOF

# 4) 验证
openspec validate $CHANGE --strict
```

## 多能力示例

```
openspec/changes/add-2fa-notify/
├── proposal.md
├── tasks.md
└── specs/
    ├── auth/
    │   └── spec.md   # ADDED: Two-Factor Authentication
    └── notifications/
        └── spec.md   # ADDED: OTP email notification
```

auth/spec.md
```markdown
## ADDED Requirements
### Requirement: Two-Factor Authentication
...
```

notifications/spec.md
```markdown
## ADDED Requirements
### Requirement: OTP Email Notification
...
```

## 最佳实践

### 简洁优先
- 默认新增代码 <100 行
- 在证明不足前保持单文件实现
- 无明确理由避免引入框架
- 选择稳妥、成熟的方案

### 复杂度触发条件
只有在以下情况才增加复杂度：
- 性能数据表明当前方案过慢
- 有明确规模需求（>1000 用户，>100MB 数据）
- 多个已验证场景需要抽象

### 清晰引用
- 使用 `file.ts:42` 格式标注代码位置
- 规格引用为 `specs/auth/spec.md`
- 链接相关变更和 PR

### 能力命名
- 使用动词-名词：`user-auth`、`payment-capture`
- 每个能力聚焦单一目的
- 10 分钟可理解规则
- 描述中包含 "AND" 则考虑拆分

### 变更 ID 命名
- 使用 kebab-case，简短且描述清晰：`add-two-factor-auth`
- 优先动词前缀：`add-`、`update-`、`remove-`、`refactor-`
- 确保唯一；如已占用，添加 `-2`、`-3` 等

## 工具选择指南

| 任务 | 工具 | 为什么 |
|------|------|-----|
| 按模式找文件 | Glob | 快速匹配 |
| 搜索代码内容 | Grep | 优化的正则搜索 |
| 读取指定文件 | Read | 直接文件访问 |
| 探索未知范围 | Task | 多步骤调查 |

## 错误恢复

### 变更冲突
1. 运行 `openspec list` 查看进行中的变更
2. 检查是否有重叠规格
3. 与变更负责人协调
4. 考虑合并提案

### 验证失败
1. 使用 `--strict` 运行
2. 检查 JSON 输出细节
3. 验证规格文件格式
4. 确保场景格式正确

### 缺少上下文
1. 先阅读 project.md
2. 检查相关规格
3. 查看最近归档
4. 询问澄清

## 快速参考

### 阶段指示
- `changes/` - 已提案，尚未构建
- `specs/` - 已构建并部署
- `archive/` - 已完成变更

### 文件用途
- `proposal.md` - 为什么、做什么
- `tasks.md` - 实现步骤
- `design.md` - 技术决策
- `spec.md` - 需求与行为

### CLI 要点
```bash
openspec list              # 有哪些变更在进行?
openspec show [item]       # 查看详情
openspec validate --strict # 是否正确?
openspec archive <change-id> [--yes|-y]  # 标记完成（自动确认）
```

记住：规格是真相。变更是提案。保持同步。
