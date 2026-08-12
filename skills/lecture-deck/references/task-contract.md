# 主智能体调用契约 v2

输入仍接受 `zoom-lecture-task/v1` 结构或自然语言；输出升级为 `zoom-lecture/v2`。

## 1. 缺省值

| 字段 | 默认 |
|---|---|
| canvas | `ppt169` |
| language | `zh-CN` |
| style | `anthropic-academic` |
| density | `balanced`，但受 v2 视觉密度硬约束覆盖 |
| zoomPointsPerSlide | content 页 2–4 |

`slideCount` 表示**总页数，包含 opening 与 closing**；不得少于 3。

默认总页数：problem 5–7；concept 6–8；lesson 8–12。

## 2. 输出目录

```text
<outputDir>/
├── slides/
├── runtime/
│   └── index.html
├── lecture.json
└── manifest.json
```

runtime 必须复制本 Skill 的 `assets/runtime/index.html`，不可省略。

## 3. 任务补全

自然语言输入缺字段时不要反问。自行补：受众、2–4 个学习目标、视觉大纲、总页数、页面结论与 zoom 点；所有推断写入 `manifest.assumptions`。

## 4. 回执

返回：

- 总页数 / content 页数 / step 数
- `lecture.json`
- `runtime/index.html`
- `slides/`
- 严格校验结果
- assumptions / deviations

不要粘贴完整 HTML 或 JSON。
