# LingxiLearn 教学 Skills

这里是 LingxiLearn 当前实际开发并可被项目加载的 Skills。每个目录至少包含一个 `SKILL.md`；目录里的 `references/` 是规则和契约，`assets/` 是模板与样例，`scripts/` 是校验或构建工具，`tests/` 是回归测试。

## Skill catalog

Skill directories are intentionally not listed here. The repository tree under
`skills/*/SKILL.md` is the only source of truth, and the website scanner discovers every matching
directory at build time. This README remains explanatory documentation rather than a registry or
allowlist. To inspect the live catalog locally, run `npm run discover --prefix web` or
`npm run check --prefix web`.

## Skill 内部的“子技能”怎么理解

项目没有单独的嵌套 `subskills/` 目录。所谓子能力主要写在各 Skill 自己的 `references/`、`scripts/` 和模板中：

- `adaptive-pedagogy` 内置多种教学策略：轻提示、渐进提示、概念冲突、逐步撤架、针对性解释、教回、迁移检查等；它们不是独立 Agent。
- `interactive-lecture-deck` 下面有开场页、内容页、结尾页模板，以及课件构建、锚点测量、严格校验工具。
- `interactive-visual-explainer` 下面有设计 token、交互模式、SVG 制作规范、反模式检查和配色校验。
- `lesson-intro` 下面有 hook 选择、HTML/视觉规范、内容边界和输出校验。
- `quiz-generator` 下面有题型设计规则、答案隔离/公开快照和契约校验。
- `curriculum-graph-builder` 下面有图谱模型、创建/扩展/更新合并规则和 schema 校验。
- `learner-state-reflector` 下面有事件压缩、证据追踪和状态提案校验。
- `skill-eval-harness` 下面有组件、轨迹、教学质量、学习结果四层评测，以及单例和全仓 suite 工具。

所有同名 Skill 目录（包括 shared、runtime 和 utility 能力）都会参与本地维护和自动同步。

## 自动同步到 LingxiSkills

先在本仓库执行一次：

```powershell
pwsh -File .\scripts\install-skill-sync-hook.ps1
```

之后，只要一次 Git commit 包含 `skills/` 改动，`post-commit` 会自动：

1. 克隆 `https://github.com/LingXi-Org/LingxiSkills.git` 的 `main`；
2. 用本地同名 Skill 覆盖远端同名目录；
3. 保留远端独有目录；
4. 在 LingxiSkills 中自动 commit 并 push 到 `main`。

也可以手工预览或同步：

```powershell
pwsh -File .\scripts\sync-skills.ps1 -DryRun
pwsh -File .\scripts\sync-skills.ps1
```

这套机制的同步单位是“提交”，不是每次保存文件；这样可以避免半成品、临时文件和未通过检查的内容被直接发布。推送使用本机 GitHub 登录凭据，首次失败时先确认 `gh auth status` 和 Git 的 HTTPS 凭据可用。
