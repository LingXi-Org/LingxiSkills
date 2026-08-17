## 变更说明

<!-- 简要说明本 PR 做了什么、为什么需要这项变更。 -->

## 变更类型

- [ ] 新增 Skill
- [ ] 修改现有 Skill 行为
- [ ] 资源 / 文档更新
- [ ] 校验 / 评测 / CI
- [ ] 其他

## 通用自查

- [ ] PR 保持单一职责，没有混入无关的大规模重构。
- [ ] 我已检查提交内容中不存在 Token、密钥、个人信息或其他敏感数据。
- [ ] 我已运行与本次变更相关的本地校验或测试。
- [ ] 文档、示例和实际行为保持一致。

## 新 Skill / Skill 行为变更自查

> 如果本 PR 不涉及 Skill，可将本节保持未勾选并在下方说明 N/A。

- [ ] Skill 位于 `skills/<name>/SKILL.md`，并使用大写 `SKILL.md`。
- [ ] `name` 与目录名一致，并使用小写 kebab-case。
- [ ] `description` 同时说明“做什么”和“什么时候使用”。
- [ ] 顶层 frontmatter 只使用 LingxiGraph 支持的标准字段：必填 `name`、`description`；可选 `license`、`compatibility`、`metadata`、`allowed-tools`。
- [ ] 项目扩展信息放在 `metadata`，没有添加私有顶层字段。
- [ ] 运行时资源只通过 `references/`、`scripts/`、`assets/` 暴露。
- [ ] 不存在绝对路径、`..` 路径逃逸、symlink、junction/reparse point 或特殊文件。
- [ ] `SKILL.md` 不超过 256 KiB，单个资源不超过 1 MiB。
- [ ] `allowed-tools` 仅作为提示，没有被当作权限授予机制。
- [ ] `scripts/` 中的内容不会因 Skill 被发现或读取而自动执行。
- [ ] 已运行 `python -m skills_ref.cli validate skills/<name>`。
- [ ] 涉及行为变化时，已补充或更新必要的测试 / `skill-eval-harness` 评测覆盖。

## 验证结果

<!-- 粘贴关键命令和结果；新增 Skill 的 LingxiGraph Skill Review Action 也应通过。 -->

```text
N/A
```
