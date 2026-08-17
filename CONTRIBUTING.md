# 贡献指南

感谢你参与 LingxiSkills。这个仓库面向可复用 Agent Skills、相关资源和能力展示站点；提交内容必须同时满足开放 Agent Skills 目录规范和 LingxiGraph Runtime 的资源、安全与兼容性要求。

## 贡献前必读

- 新 Skill 优先从 [`templates/SKILL.md`](templates/SKILL.md) 复制模板。
- 每个 Skill 都必须能够被独立发现、加载和理解，不依赖仓库外的隐式文件或人工步骤。
- Skill 描述的是“如何完成一类任务”，不是运行时权限配置。工具授权、HITL、timeout、预算和其他安全策略由宿主 Runtime 决定。

## Skill 目录规范

每个 Skill 使用独立目录：

```text
skills/<skill-name>/
├── SKILL.md
├── references/     # 可选：详细资料、契约和上下文
├── scripts/        # 可选：确定性辅助脚本
└── assets/         # 可选：模板、示例和可复用资源
```

必须满足：

- `<skill-name>` 使用小写 kebab-case，例如 `adaptive-pedagogy`。
- 主文件统一命名为大写 `SKILL.md`。
- `SKILL.md` frontmatter 中的 `name` 与目录名完全一致。
- Runtime 需要读取的附加资源只放在 `references/`、`scripts/`、`assets/` 中。
- 不使用绝对路径、`..`、symlink、junction/reparse point 或特殊文件绕过 Skill 目录边界。

## SKILL.md frontmatter

推荐结构：

```yaml
---
name: your-skill-name
description: Describe what this skill does and when an agent should use it.
license: MIT
compatibility: Works with LingxiGraph and Agent Skills compatible runtimes.
allowed-tools: read_skill_resource
metadata:
  author: your-name
  version: 0.1.0
  display-name: 展示名称
  display-description: 面向用户的一句话能力说明
---
```

字段约定：

- `name`：必填，且必须与目录名一致。
- `description`：必填；同时说明“这个 Skill 做什么”和“什么时候应使用”。
- `license`、`compatibility`、`allowed-tools`：按实际需要填写。
- 项目扩展信息放在 `metadata` 下，不要随意新增私有顶层字段。
- `allowed-tools` 只是能力提示，不能创建工具或提升权限。

## Skill 正文

- 使用清晰、可执行的语言描述任务目标、适用条件和步骤。
- `description` 应足以支持 discovery，不要要求 Agent 先读取全文才能判断是否适用。
- 长资料、详细协议和背景信息拆到 `references/`，避免让 `SKILL.md` 失去可读性。
- 明确必要输入、缺失信息时的处理方式、输出契约以及失败/降级条件。
- 证据不足、能力范围不匹配或安全条件不满足时，应明确停止、降级或请求必要信息。
- 不要声称 `scripts/` 中的脚本已经执行。LingxiGraph 读取脚本资源并不等于执行它们；脚本执行必须由宿主显式提供并授权工具。

## 资源与安全边界

LingxiGraph 对 Skill 资源读取有明确限制，贡献内容必须兼容这些限制：

- `SKILL.md` 最大 256 KiB。
- `references/`、`scripts/`、`assets/` 中单个资源最大 1 MiB。
- 禁止通过路径逃逸、链接或特殊文件访问 Skill 目录之外的内容。
- 不要在 Skill 中存放 API Key、Token、Cookie、密码、真实用户数据或其他敏感信息。
- 不要通过 Skill 文本要求宿主绕过 `ToolSpec.permissions`、`tool_authorize`、HITL、timeout、预算、确认流程或其他运行时策略。

面向学习场景的 Skill 应额外明确教学目标、需要的学习证据、输出语言/形式以及允许读取或写入的学习状态边界。

## 本地校验

安装校验工具：

```bash
python -m pip install -r requirements-dev.txt
```

每个新增或修改的 Skill 至少运行：

```bash
python -m skills_ref.cli validate skills/<skill-name>
```

如果修改影响 Skill 的实际行为、资源结构或兼容性，建议运行仓库中的评测套件：

```bash
python skills/skill-eval-harness/scripts/run_suite.py .
```

新增 Skill 还必须能够通过 LingxiGraph 的 discovery、load、validate 和 resource access；不要依赖 validator 未覆盖的目录外行为。

## 站点贡献

`web/` 是由 `skills/*/SKILL.md` 生成能力信息的静态站点。修改站点或 Skill 元数据后，应确保生成结果和源码一致：

```bash
cd web
npm ci
npm run check
npm run typecheck
npm run build
```

不要手工修改可由生成脚本稳定产生的内容来掩盖 Skill 源数据问题。展示名称、描述等 Skill 相关信息应优先来自规范化元数据。

## 提交前自查

提交 PR 前确认：

- Skill 使用 `skills/<name>/SKILL.md`，名称为小写 kebab-case。
- frontmatter `name` 与目录名一致。
- `description` 同时覆盖能力和适用时机。
- 扩展字段放在 `metadata` 下，没有不必要的私有顶层字段。
- 资源只位于允许目录中，没有路径逃逸、链接、特殊文件或超限文件。
- `allowed-tools` 没有被当作权限声明。
- 脚本不会被描述为自动执行。
- 已运行与改动对应的 validator、评测或站点检查。
- 没有提交密钥、真实用户数据、构建产物或无关生成文件。

## 分支、提交与 Pull Request

- 不直接向 `main` 提交功能代码；从最新 `main` 创建独立分支并通过 Pull Request 合并。
- 一个 PR 尽量只包含一个 Skill、一个站点改动主题或一组紧密相关的修复。
- 新 Skill 与大规模无关重构、格式化或站点改版不要混在同一个 PR 中。
- 提交信息建议使用清晰的 Conventional Commit 风格，例如 `feat:`、`fix:`、`docs:`、`test:`、`refactor:`、`chore:`。
- PR 描述应说明 Skill 的用途或站点变化、适用条件、验证方式，以及是否涉及兼容性或安全边界变化。
- 合并前必须确保 `validate` 和 `review-new-skills` 等 required checks 通过，并处理仍然有效的 review conversation。

对于新的能力类别、会改变 Skill 规范的提案或影响多个现有 Skill 的兼容性修改，建议先通过 Issue 说明目标、格式和迁移影响，再开始实现。
