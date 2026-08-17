<div align="center">

# LingxiSkills

**面向 AI 学习产品的可组合 Agent Skills。**

将教学、可视化、测评、学习者状态、编排与评测能力沉淀为可复用的 Skill，并由 LingxiGraph 或其他兼容 Agent Skills 的运行时按需发现和加载。

[English](README.en.md) · [LingxiGraph](https://github.com/LingXi-Org/LingxiGraph) · [LingxiLearn](https://github.com/LingXi-Org/LingxiLearn)

</div>

## 项目定位

LingxiSkills 是 LingXi 技术栈中的开放能力层。每个 Skill 都是 `skills/` 下可独立发现的目录，以 `SKILL.md` 作为能力契约，可按需附带 `references/`、`scripts/` 与 `assets/`。

```text
学习产品 / Agent
      │
      ▼
LingxiGraph Runtime
      │
      ▼
LingxiSkills
SKILL.md · references · scripts · assets
```

LingxiGraph 负责运行时发现、渐进加载、工具授权、HITL、超时、预算与安全边界；LingxiSkills 负责可复用能力的行为说明、资源与质量门禁。Skill 中的脚本只是可读取资源，读取 Skill 不代表授权或执行脚本。

## 与 LingxiGraph 集成

```python
from lingxigraph import FilesystemSkillSource, HumanMessage, create_agent

skills = FilesystemSkillSource("/path/to/LingxiSkills/skills")
agent = create_agent(model, skills=skills)
result = agent.invoke({"messages": [HumanMessage("帮我解释交叉熵")]})
```

LingxiGraph 会先只暴露 Skill 的 `name` 与 `description`；模型判断需要后，再通过 `read_skill` 读取完整 `SKILL.md`，并通过 `read_skill_resource` 按需读取资源。

也可以通过开放 Skills CLI 安装：

```bash
npx skills add LingXi-Org/LingxiSkills
npx skills add LingXi-Org/LingxiSkills --skill adaptive-pedagogy
```

## LingxiGraph Skill 规范

LingxiGraph 直接读取开放 Agent Skills 目录，不定义私有 Skill 格式。提交到本仓库的 Skill 应满足：

- 路径为 `skills/<skill-name>/SKILL.md`，文件名使用大写 `SKILL.md`。
- `SKILL.md` 必须包含 YAML frontmatter。
- `name`、`description` 为必填字段。
- `license`、`compatibility`、`metadata`、`allowed-tools` 为可选标准字段；扩展信息放入 `metadata`，不要增加私有顶层字段。
- Skill 目录名与 `name` 保持一致，并使用小写 kebab-case。
- 运行时可读取资源仅位于 `references/`、`scripts/`、`assets/`。
- 禁止绝对路径、`..` 路径逃逸、symlink、junction/reparse point、特殊文件和越界解析。
- `SKILL.md` 最大 256 KiB；单个资源最大 1 MiB。
- `allowed-tools` 只是能力提示，不能创建工具，也不能绕过 `ToolSpec.permissions`、`tool_authorize`、HITL、timeout 或运行预算。

可直接从 [`templates/SKILL.md`](templates/SKILL.md) 复制标准模板。

## 仓库结构

```text
LingxiSkills/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md
│       ├── references/    # 可选：说明、契约、上下文
│       ├── scripts/       # 可选：确定性辅助脚本；不会被自动执行
│       └── assets/        # 可选：模板与可复用输出资源
├── templates/
│   └── SKILL.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
├── CONTRIBUTING.md
└── requirements-dev.txt
```

## 提交新 Skill

1. 先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，或从 [`templates/SKILL.md`](templates/SKILL.md) 创建新目录。
2. 本地运行开放 Agent Skills 标准校验：

```bash
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/<skill-name>
```

3. 提交 PR，并完成 PR 模板中的自查项。

## 贡献与质量

新增能力、行为修改、资源更新都应保持 `SKILL.md` 简洁、可发现且具备明确触发条件。复杂细节放入 `references/`，确定性辅助逻辑放入 `scripts/`，可复用输出资源放入 `assets/`。涉及生产教学行为时，建议同步补充或更新评测覆盖。

完整要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

见 [LICENSE](LICENSE)。
