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
生产 Skill 还应提供 `phase`、`critical-path`、`learner-facing`、
`state-write-mode`、`parallel-safe`、`latency-class` 和 `eval-suite`，供运行时编译执行计划。

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

- `interactive-visual-explainer`：为适合通过观察和操作理解的概念生成可离线运行的交互式 HTML 讲解页面。
- `lesson-intro`：基于已有课程上下文直接生成自然有趣的课程开场，不联网搜索或聚合检索结果。
- `interactive-lecture-deck`：构建包含视觉化幻灯片、结构化讲解数据和离线交付能力的自包含 HTML 课程课件。
- `adaptive-pedagogy`：根据学习证据选择低摩擦教学策略，生成即时辅导回应，并可选地提出状态更新或可视化请求。
- `learner-state-reflector`：将近期学习事件整理为谨慎、可追溯的学习状态更新建议，不打断教学流程。
- `formative-assessor`：把确定性判分和学习者明确信号转为供 `adaptive-pedagogy` 使用的结构化学习证据，不直接面向学习者发言。
- `retrieval-practice-builder`：后台预取一个有证据依据的检索、迁移、边界或误区辨析任务，并分离公开题面与内部评分键。
- `quiz-generator`：基于已讲授的课程内容生成紧凑、可判分且能识别理解误区的形成性测评。
- `skill-eval-harness`：从组件契约、执行轨迹、教学质量和学习结果四层评测 Skill，生成确定性开发报告。
- `curriculum-graph-builder`：根据学习上下文构建或增量扩展个性化课程知识图谱，保持稳定 ID、明确关系方向，并谨慎处理学习状态覆盖层。

## 执行计划不变量

`lesson-intro` 与 `interactive-lecture-deck` 属于同一准备阶段，可以并行运行；个性化教学回合
只允许 `adaptive-pedagogy` 作为 learner-facing writer。`formative-assessor` 只在证据模糊时
作为结构化条件分支；学习状态反思、检索练习、可视化、测评和补救课件都属于非阻塞 sidecar
或预取任务，不能延迟已经渲染的学习者回应。运行时应直接使用 Skill 元数据编译执行计划，
并强制 `learner_facing_writer_count <= 1`。

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
python -m skills_ref.cli validate skills/formative-assessor
python -m skills_ref.cli validate skills/retrieval-practice-builder
python -m skills_ref.cli validate skills/quiz-generator
python -m skills_ref.cli validate skills/skill-eval-harness
python -m skills_ref.cli validate skills/curriculum-graph-builder
```

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

开发期可运行所有已提交的评测套件：

```bash
python skills/skill-eval-harness/scripts/run_suite.py .
```
