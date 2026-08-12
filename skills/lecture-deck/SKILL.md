---
name: lecture-deck
description: Create fixed-size, self-contained HTML lecture slides with a visual-first academic style, structured lecture.json zoom data, anchored explanations, and a local presentation runtime. Use when generating lesson decks, problem walkthroughs, course slides, zoomable HTML presentations, lecture manifests, or interactive step-by-step teaching visuals. Keep slides concise, make causal structure visible, and use the bundled templates, schemas, references, and validator.
---

# Lecture Deck

本 Skill 是**多智能体系统中的学术 PPT 开发智能体**。它不负责决定课程事实是否正确，
而负责把主智能体给定的讲解内容重构成一套真正适合课堂讲解的视觉叙事：

> **幻灯片负责让学生“看见结构”，小窗负责让学生“听懂原因”。**

产物必须彼此严格对齐：

| 产物 | 形态 | 作用 |
|---|---|---|
| **幻灯片** | `slides/sNN.html`，每页一个自包含 HTML，固定 1280×720 | 放映画面；少文字，多图像/图表/结构图 |
| **讲解数据** | `lecture.json` | 驱动 overview / zoom、锚点、高亮与教授式小窗 |
| **运行时** | `runtime/index.html` | 标准放映器：丝滑缩放、3D 透视避让、学术小窗、自然文字显现 |
| **回执** | `manifest.json` | 产物清单与校验结论 |

---

## 强制加载顺序

1. 读本文件。
2. 读 [`references/task-contract.md`](references/task-contract.md)，解析任务并按默认值补齐，**不要反问主智能体**。
3. 读 [`references/design-system.md`](references/design-system.md)、
   [`references/visual-authoring.md`](references/visual-authoring.md)、
   [`references/slide-authoring.md`](references/slide-authoring.md)。
4. 从 [`assets/templates/slide-base.html`](assets/templates/slide-base.html) 起手，先做 `s01 opening`。
5. 读 [`references/lecture-data.md`](references/lecture-data.md) 与
   [`references/zoom-contract.md`](references/zoom-contract.md)，再写 `lecture.json`。
6. 把 [`assets/runtime/index.html`](assets/runtime/index.html) 复制到工程 `runtime/index.html`。
7. 跑 `python3 scripts/validate_deck.py <project_dir> --strict`；**零 ERROR、零 WARNING 才算标准交付**。

---

## 核心执行纪律

1. **首尾页强制存在**：`s01` 必须 `data-slide-role="opening"`；最后一页必须 `closing`；中间全部为 `content`。
2. **画布不可变**：每页恒为 1280×720；页面自身不响应式。外层 runtime 负责 fit。
3. **绝对定位**：直接内容块一律 `position:absolute` + 显式坐标；锚点矩形必须稳定。
4. **视觉先于文字**：除 opening / closing 外，每页必须有至少一个 `data-visual` 主视觉对象；禁止纯文字正文页。
5. **少字是硬约束**：标题是结论，不是章节名；正文只留关键词、条件、转折与结论。详细解释进入 panel。
6. **先构图再写字**：先画核心关系（SVG / 图表 / 结构图 / 公式关系 / 时间线 / 对比图），再补最少标签。
7. **锚点先行**：先确定要放大讲哪 2–4 个视觉局部，再切内容块。不要写完页面再硬找锚点。
8. **一步一意**：一个 zoom step 只解释一个观察或因果；panel 讲不完就拆 step，不得滚成讲义。
9. **自包含**：幻灯片不发网络请求、不含 `<script>`；图片只能内联 SVG 或 `data:` URI。
10. **页面本身不动**：幻灯片 CSS 不写 transition / animation；所有运动只由 runtime 执行。
11. **数据双向对齐**：`lecture.json` 的 anchor 与 HTML 的 `data-anchor` / `data-rect` 逐值一致。
12. **教授式讲解，不是 AI 读稿**：panel 用自然口语、观察→原因→意义的节奏，由浅入深；不复述屏幕文字。
13. **不发明字段**：schema 外字段只进入 `extensions`。

---

## PPT 内容重构原则

收到一段长材料时，**不得按段落分页**。先做这四步：

1. 写一句学习目标：“这一段结束后，学生应能看出 / 判断 / 解释 ___”。
2. 把材料压缩成 3–7 个“视觉命题”：每个命题都能画成关系、变化、比较或过程。
3. 为每个命题选择一个主视觉语法：关系图、流程、坐标图、时间线、分层结构、对比、公式结构化、示例拆解。
4. 页面只保留视觉命题的**结论句 + 必要标签**；原因、直觉、误区放进 zoom panel。

**禁止**把“原文缩短一点”误当成 PPT 设计。

---

## 页序标准

最少 3 页：

1. **Opening**：标题 + 一句课程承诺 + 一个抽象主视觉；只做 overview。
2. **Content × N**：每页一个核心判断，主视觉占主导，2–4 个 zoom 点。
3. **Closing**：把全 deck 压缩成 2–3 个可带走的视觉结论 + 一句收束；默认 overview，可有最多 2 个 zoom。

任务指定 `slideCount` 时，数字指**总页数，包含首尾页**。

默认总页数：

| 任务类型 | 默认总页数 |
|---|---|
| `problem` 单题讲解 | 5–7 页 |
| `concept` 单概念讲解 | 6–8 页 |
| `lesson` 课程章节 | 8–12 页 |

---

## 工作流

### Step 1 — 解析任务，写视觉大纲

内部大纲不是“标题 + 三条 bullet”，而是：

- 页角色：opening / content / closing
- 一句话页面结论
- 主视觉类型与它编码的关系
- 2–4 个 zoom 锚点
- 每个 zoom 想让学生意识到什么

### Step 2 — 建立工程目录

```text
<project_dir>/
├── slides/
│   ├── s01.html
│   └── ...
├── runtime/
│   └── index.html
├── lecture.json
└── manifest.json
```

### Step 3 — 逐页手写 HTML

以 `assets/templates/slide-base.html` 为视觉与结构基线，按 `assets/templates/layouts.md` 选版式。
优先手写 SVG；只有真实照片/纹理确有教学价值时才使用内联 data URI 图片。

节奏：先完成 opening + 第一张 content 并自查视觉语言，再连续完成剩余 content 与 closing。

### Step 4 — 写 lecture.json

每张 content 页通常：

`overview → zoom A → zoom B → [zoom C] → [overview]`

opening 必须 overview；closing 以 overview 收束为主。

### Step 5 — 安装标准 runtime

复制：

```bash
mkdir -p <project_dir>/runtime
cp assets/runtime/index.html <project_dir>/runtime/index.html
```

runtime 默认从 `../lecture.json` 加载。使用本地 HTTP server 打开可获得完整体验。

### Step 6 — 校验

```bash
python3 scripts/validate_deck.py <project_dir> --strict
```

必要时：

```bash
python3 scripts/measure_anchors.py <project_dir> --round 8
```

### Step 7 — 回执

回报：总页数、content 页数、step 总数、runtime 路径、校验结论、假设与降级项。

---

## 参考文件索引

| 文件 | 作用 |
|---|---|
| `references/task-contract.md` | 输入、默认值、交付目录 |
| `references/design-system.md` | Anthropic 学术风令牌与 PPT 尺度 |
| `references/visual-authoring.md` | 从“讲义”到“视觉解释”的强约束与反模式 |
| `references/slide-authoring.md` | 单页 HTML、视觉对象、锚点、禁止项 |
| `references/lecture-data.md` | lecture.json 与教授式 panel 写作 |
| `references/zoom-contract.md` | 2D 相机 + 3D 透视避让运行时契约 |
| `assets/templates/opening.html` / `assets/templates/slide-base.html` / `assets/templates/closing.html` | 首页面、正文页、结尾页骨架 |
| `assets/templates/layouts.md` | opening/content/closing 与视觉版式配方 |
| `assets/runtime/index.html` | 标准运行时实现 |
| `assets/runtime/demo-slide.html` | 可独立预览的标准学术 HTML 页 |
| `scripts/validate_deck.py` | 严格结构/视觉/讲解数据检查 |
