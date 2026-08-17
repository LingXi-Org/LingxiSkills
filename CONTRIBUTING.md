# 贡献指南

感谢你为 LingxiSkills 提交能力、资源、修复或评测。LingxiSkills 以 LingxiGraph 的 Agent Skills Runtime 为主要运行时基线，同时保持对开放 Agent Skills 目录规范的兼容。

## 1. 新 Skill 的目录

每个新 Skill 放在独立目录中：

```text
skills/<skill-name>/
├── SKILL.md
├── references/     # 可选：详细说明、契约、上下文
├── scripts/        # 可选：确定性辅助脚本；不会被自动执行
└── assets/         # 可选：模板、示例与输出资源
```

要求：

- `<skill-name>` 使用小写 kebab-case，例如 `adaptive-pedagogy`。
- 贡献到本仓库时统一使用大写文件名 `SKILL.md`。
- `SKILL.md` frontmatter 中的 `name` 必须与目录名一致。
- 运行时需要读取的资源只放在 `references/`、`scripts/`、`assets/`。

## 2. SKILL.md frontmatter

LingxiGraph 不定义私有 Skill 格式。标准顶层字段如下：

```yaml
---
name: your-skill-name
description: Describe what the skill does and when it should be used.
license: MIT
compatibility: Works with LingxiGraph and Agent Skills compatible runtimes.
allowed-tools: read_skill_resource
metadata:
  author: your-name
  version: 0.1.0
---
```

其中：

- `name`：必填，非空字符串。
- `description`：必填，既说明能力，也说明何时应该使用。
- `license`：可选。
- `compatibility`：可选。
- `metadata`：可选；项目扩展信息应放在这里，而不是新增私有顶层字段。
- `allowed-tools`：可选，仅作为能力提示。

`allowed-tools` 不能创建工具，也不能绕过 LingxiGraph 的 `ToolSpec.permissions`、`tool_authorize`、HITL、timeout、预算或其他运行时策略。

## 3. Skill 正文

- 用清晰、可执行的祈使句描述行为。
- 让 `description` 足以支持 discovery，不要依赖模型先读取全文才知道用途。
- 保持 `SKILL.md` 简洁；复杂规则和长资料拆到 `references/`。
- 明确输出契约、失败/降级行为和必要的安全边界。
- 不要声称脚本已被执行，除非宿主运行时另行暴露并授权了执行工具。
- 面向学习者的内容应明确语言、教学目标、证据使用方式和状态写入边界。

可复制 [`templates/SKILL.md`](templates/SKILL.md) 作为起点。

## 4. LingxiGraph 安全边界

提交内容必须兼容 LingxiGraph 的资源读取约束：

- 禁止绝对路径和 `..` 路径逃逸。
- 禁止 symlink、junction/reparse point 与特殊文件。
- 不允许从 Skill 目录越界解析资源。
- `SKILL.md` 最大 256 KiB。
- 单个 `references/`、`scripts/`、`assets/` 资源最大 1 MiB。
- 读取 `scripts/` 不会自动执行脚本。

不要通过 Skill 文本尝试提升工具权限、绕过审批、取消预算或规避宿主安全策略。

## 5. 本地校验

至少运行开放 Agent Skills reference validator：

```bash
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/<skill-name>
```

如果修改了多个 Skill，请逐个校验。涉及行为变化时，建议运行仓库中的评测套件：

```bash
python skills/skill-eval-harness/scripts/run_suite.py .
```

## 6. 新 Skill PR 的自动审查

当 PR 新增 `skills/*/SKILL.md` 或 `skills/*/skill.md` 时，`.github/workflows/lingxigraph-skill-review.yml` 会：

1. 找出本次 PR 新增的 Skill 目录；
2. 运行 `skills-ref` 标准校验；
3. 从 `LingXi-Org/LingxiGraph@main` 安装当前 LingxiGraph；
4. 直接调用 `lingxigraph.validate_skill()`；
5. 使用 `FilesystemSkillSource` 完成 discovery、load，并逐个读取 `references/`、`scripts/`、`assets/` 中的资源，以验证真实运行时兼容性。

因此新增 Skill 的 LingxiGraph 审查以实际运行时为准。

## 7. 提交前自查

- 新 Skill 已使用 `skills/<name>/SKILL.md`。
- `name` 与目录名一致，且为小写 kebab-case。
- `description` 同时说明“做什么”和“什么时候使用”。
- 未增加 LingxiGraph 不支持的私有顶层 frontmatter 字段。
- 扩展信息已放入 `metadata`。
- 资源只通过 `references/`、`scripts/`、`assets/` 暴露给运行时。
- 没有 symlink、路径逃逸、特殊文件或超限资源。
- `allowed-tools` 没有被当作权限声明使用。
- 脚本不会因 Skill 被发现或读取而自动执行。
- 已运行本地校验；行为变化已有必要的测试或评测覆盖。
- PR 已完成 `.github/pull_request_template.md` 中的自查。

## 8. Issue 与 PR

新能力建议先使用“提交新 Skill”Issue 模板说明用途、触发条件、输出契约与评测方式；兼容性或行为缺陷使用“Skill 缺陷”模板。

PR 请尽量保持单一职责。新 Skill 与大规模无关重构不要混在同一个 PR 中，以便审查与回滚。
