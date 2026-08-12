# LingxiSkills

面向 LingxiGraph 及其他兼容 Agent Skills 标准运行时的开放 Skill 库。

`skills/` 下的每个目录都是独立的标准 Skill。每个 Skill 必须包含带 YAML
frontmatter 的 `SKILL.md`，并可包含 `scripts/`、`references/` 与 `assets/`。
本仓库不定义 LingxiGraph 私有 Skill 格式。

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

- `hello`：按用户指定的语言和语气生成简短问候，展示 frontmatter、reference、asset
  模板和不会自动执行的示例脚本。
- `visual-explainer`：为适合通过图形和控件理解的知识点生成可离线打开的单文件交互式
  HTML 讲解页。
- `lecture-hook`：检索并生成有证据依据、能自然过渡到目标知识点的简短课程开场。
- `lecture-deck`：生成固定尺寸、自包含的 HTML 讲解课件，包含结构化 zoom 数据、protected-view
  空间运行时、离线 `dist/lecture.html` 发布物与严格的视觉/结构校验。
- `adaptive-pedagogy`：根据学习证据选择一个低摩擦、可解释的教学策略，避免不必要的阻塞式
  追问。
- `learning-state-reflector`：将学习事件压缩为谨慎、非阻塞的状态更新和验证债务建议，不作
  教育诊断。

## 本地校验

核心运行时保持零依赖；开发校验依赖单独安装：

```bash
python -m venv .venv
python -m pip install -r requirements-dev.txt
python -m skills_ref.cli validate skills/hello
python -m skills_ref.cli validate skills/visual-explainer
python -m skills_ref.cli validate skills/lecture-hook
python -m skills_ref.cli validate skills/lecture-deck
python -m skills_ref.cli validate skills/adaptive-pedagogy
python -m skills_ref.cli validate skills/learning-state-reflector
```

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。
