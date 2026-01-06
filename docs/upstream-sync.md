# Upstream 同步指南（Fork 维护）

本指南用于在 fork 项目中定期同步上游更新，并尽量降低冲突与侵入性。

## 1) 一次性配置上游仓库

```bash
git remote add upstream <UPSTREAM_URL>
git fetch upstream
```

确认：

```bash
git remote -v
```

## 2) 常规同步（推荐：merge 方式）

适合多数情况，历史清晰，不重写提交。

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

## 3) 可选：rebase 同步（线性历史）

如果团队偏好线性历史，可以使用 rebase；注意需要强制推送。

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin main
```

## 4) 分支使用建议

- main 分支尽量只做“同步上游”的提交。
- 功能改动放在独立分支（feature/*），合并回 main。
- 上游同步后，再将 main rebase/merge 到功能分支。

示例：

```bash
git checkout feature/locale
git merge main
```

或

```bash
git checkout feature/locale
git rebase main
```

## 5) 降低冲突的习惯

- **新增优先**：优先新增文件/目录，避免直接改上游已有文件。
- **小范围改动**：必须修改已有文件时，尽量集中在单一模块。
- **保持模板分离**：如本项目的 `templates/<locale>/`、`schemas/<schema>/locales/`，让翻译和上游模板解耦。
- **定期同步**：保持小步合并，避免积累大规模冲突。

## 6) 冲突处理辅助

启用 rerere，让 Git 记住你解决冲突的方式：

```bash
git config rerere.enabled true
```

查看差异范围：

```bash
git range-diff upstream/main...HEAD
```

## 7) 同步后建议检查

```bash
pnpm test
```

如需要，可补充 `openspec locales validate --all --json` 做翻译覆盖校验。
