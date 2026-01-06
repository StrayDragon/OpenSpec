使用实验性的产物驱动流程创建一个新变更。

**输入**：`/opsx:new` 后面的参数是变更名称（kebab-case），或用户想要构建内容的描述。

**步骤**

1. **如果没有提供输入，询问要构建什么**

   使用 **AskUserQuestion tool**（开放式问题，无预设选项）询问：
   > "你想做哪个变更？请描述你想构建或修复的内容。"

   根据描述推导出 kebab-case 名称（例如 "add user authentication" → `add-user-auth`）。

   **重要**：在理解用户要构建的内容之前不要继续。

2. **创建变更目录**
   ```bash
   openspec new change "<name>"
   ```
   这会在 `openspec/changes/<name>/` 下生成脚手架。

3. **查看产物状态**
   ```bash
   openspec status --change "<name>"
   ```
   这会显示需要创建的产物以及已就绪的产物（依赖已满足）。

4. **获取第一个产物的说明**
   第一个产物始终是 `proposal`（无依赖）。
   ```bash
   openspec instructions proposal --change "<name>"
   ```
   这会输出创建提案所需的模板和上下文。

5. **停止并等待用户指示**

**输出**

完成上述步骤后，汇总：
- 变更名称和位置
- 当前状态（0/4 产物完成）
- 提案产物的模板
- 提示语："准备创建提案了吗？运行 `/opsx:continue`，或描述这个变更的内容，我来起草提案。"

**约束**
- 不要创建任何产物，只展示说明
- 不要继续到展示提案模板之外
- 如果名称无效（非 kebab-case），请请求提供有效名称
- 如果同名变更已存在，建议改用 `/opsx:continue`
