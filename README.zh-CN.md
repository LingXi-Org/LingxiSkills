# LingxiSkills

面向 LingxiGraph 及其他兼容 Agent Skills 标准运行时的开放 Skill 库。

`skills/` 下的每个目录都是独立的标准 Skill。每个 Skill 必须包含带 YAML
frontmatter 的 `SKILL.md`，并可包含 `scripts/`、`references/` 与 `assets/`。
本仓库不定义 LingxiGraph 私有 Skill 格式。

## 元数据与产物约定

每个 Skill 使用英文小写、两个单词以下划线连接的 `name` 作为标准运行时标识，并在
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

- `visual_explainer`：为适合通过观察和操作理解的概念生成可离线运行的交互式 HTML 讲解页面。
- `lesson_opener`：基于事实、问题、场景或误区设计自然有趣的课程开场，引导学习者产生对目标概念的兴趣。
- `lecture_builder`：构建包含视觉化幻灯片、结构化讲解数据和离线交付能力的自包含 HTML 课程课件。
- `adaptive_tutor`：根据学习证据选择低摩擦教学策略，生成即时辅导回应，并可选地提出状态更新或可视化请求。
- `state_observer`：将近期学习事件整理为谨慎、可追溯的学习状态更新建议，不打断教学流程。
- `quiz_builder`：基于已讲授的课程内容生成紧凑、可判分且能识别理解误区的形成性测评。

## 本地校验

核心运行时保持零依赖；开发校验依赖单独安装：

```bash
python -m venv .venv
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/visual_explainer
python -m skills_ref.cli validate skills/lesson_opener
python -m skills_ref.cli validate skills/lecture_builder
python -m skills_ref.cli validate skills/adaptive_tutor
python -m skills_ref.cli validate skills/state_observer
python -m skills_ref.cli validate skills/quiz_builder
```

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。
