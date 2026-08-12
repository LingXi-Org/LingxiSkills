# LingxiSkills

面向 LingxiGraph 及其他兼容 Agent Skills 标准运行时的开放 Skill 库。

`skills/` 下的每个目录都是独立的标准 Skill。每个 Skill 必须包含带 YAML
frontmatter 的 `SKILL.md`，并可包含 `scripts/`、`references/` 与 `assets/`。
本仓库不定义 LingxiGraph 私有 Skill 格式。

## 元数据与产物约定

每个 Skill 使用英文小写 kebab-case `name` 作为标准运行时标识，并在
`metadata` 中统一提供 `display-name`、`display-description`、
`output-language: zh-CN`、`output-contract`、`version` 和 `author`。Skill
加载后，LingxiGraph 会原生保留这些元数据；对于只暴露 `name` 和
`description` 的发现目录，中文展示字段也会同时写入 `description`。

所有面向学习者的生成产物默认且必须使用简体中文。协议字段、标识符、
公式、代码、URL 和文件名保留原有技术形式。

## 在 LingxiGraph 中使用

```python
from lingxigraph import FilesystemSkillSource, HumanMessage, create_agent

skills = FilesystemSkillSource("/path/to/LingxiSkills/skills")
agent = create_agent(model, skills=skills)
result = agent.invoke({"messages": [HumanMessage("用中文问候我")]})
```

初始模型上下文只包含 XML 转义后的 Skill 名称与描述。模型需要时显式调用
`read_skill` 读取完整 `SKILL.md`，再通过 `read_skill_resource` 读取
`references/`、`scripts/` 或 `assets/` 下的资源。资源读取有大小限制并防止路径越界。

Skill 中的脚本仅作为内容资源，发现或读取 Skill 都不会执行脚本。
`allowed-tools` 只是提示，不能授予运行时权限，也不能绕过 LingxiGraph 的
ToolSpec 授权、HITL、timeout、预算或其他策略控制。

## 当前 Skill

- `interactive-visual-explainer`：为适合通过图形和控件理解的知识点生成可离线打开的单文件交互式
  HTML 讲解页。
- `lesson-intro`：检索并生成有证据、妙趣横生且像人写的中文单文件 HTML 课程引入；研究信息可选地保留在页面之外，不污染学习者看到的内容。
- `interactive-lecture-deck`：生成固定尺寸、自包含的 HTML 讲解课件，包含结构化 zoom 数据、protected-view
  空间运行时、离线 `dist/lecture.html` 发布物与严格的视觉/结构校验。
- `adaptive-pedagogy`：根据学习证据选择一个低摩擦、可解释的教学策略，避免不必要的阻塞式
  追问。
- `learner-state-reflector`：将学习事件压缩为谨慎、非阻塞的状态更新和验证债务建议，不作
  教育诊断。
- `quiz-generator`：基于已讲授的课程材料生成紧凑、无泄题、可诊断理解误区的中文知识点测评，
  并提供确定性的契约校验与公开快照清理。

## 本地校验

核心运行时保持零依赖；开发校验依赖单独安装：

```bash
python -m venv .venv
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/interactive-visual-explainer
python -m skills_ref.cli validate skills/lesson-intro
python -m skills_ref.cli validate skills/interactive-lecture-deck
python -m skills_ref.cli validate skills/adaptive-pedagogy
python -m skills_ref.cli validate skills/learner-state-reflector
python -m skills_ref.cli validate skills/quiz-generator
```

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。
