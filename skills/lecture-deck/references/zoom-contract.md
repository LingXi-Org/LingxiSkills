# Zoom + Perspective Runtime Contract v2

本契约定义标准 runtime 如何解释 `lecture.json`。v2 在原有 2D zoom 之上增加**仅用于演示镜头的轻微 3D 透视避让**。

## 1. 2D 相机

画布 `W=1280,H=720`。锚点中心归一化：

```text
cx = (x + w/2) / W
cy = (y + h/2) / H
```

倍率：

| depth | scale |
|---:|---:|
|1|1.25|
|2|1.50|
|3|1.80|
|4|2.20|
|5|3.50|
|6|5.00|

若 depth / scale 均缺省：

```text
sFit = min(W/(w+2*padding), H/(h+2*padding))
scale = clamp(sFit,1.05,6.0)
```

焦点钳制：

```text
margin = 1/(2*scale)
cx' = clamp(cx, margin, 1-margin)
cy' = clamp(cy, margin, 1-margin)
```

2D 变换：

```text
tx = W/2 - cx' * W * scale
ty = H/2 - cy' * H * scale
translate(tx,ty) scale(scale)
```

## 2. 3D 透视避让

**3D 不编码任何教学数据。** 它只在 panel 出现时，让被放大的 PPT 轻轻向远离 panel 的方向侧转并平移，避免“小窗直接压在纸面上”的廉价感。

推荐参数：

- `perspective: 1800px`
- yaw：`±2.0° ~ ±3.0°`，默认 `2.4°`
- pitch：`0° ~ -1.0°`，默认 `-0.6°`
- 远离 panel 的平移：画布空间 `70–150px`
- overview：yaw / pitch / shift 全部归零

方向：

- panel 在右 → PPT 向左平移，轻微 `rotateY(+2.4deg)`；
- panel 在左 → PPT 向右平移，轻微 `rotateY(-2.4deg)`；
- panel 在底 → PPT 向上平移，轻微 `rotateX(-1deg)`；
- panel 在顶 → PPT 向下平移，轻微 `rotateX(+1deg)`。

2D 相机与 3D rig 必须分层，避免一个 transform 字符串互相污染。

## 3. 缓动

默认：`cubic-bezier(0.16,1,0.3,1)`。

- push / pan：800–1050ms
- return：550–750ms
- 3D rig 与 2D 相机使用同一节奏，但 rig 可晚 40–80ms 轻微跟随

相邻 zoom 直接在相机状态间插值，不先回 overview。

## 4. panel 避让

`placement=auto`：锚点在左半屏 → panel 右；右半屏 → panel 左。
若 `avoidAnchorIds` 导致两边都冲突，可退到底部。

panel 默认宽度以画布 420 为设计基准；runtime 应根据 fit scale 将屏幕宽度限制在约 340–480px，避免大屏过宽、小屏过窄。

## 5. panel 视觉

学术论文风：

- 米白/白纸面
- 0.5px 发丝边界
- 衬线标题、无衬线正文
- 紫色只做细小强调
- 无玻璃、无发光、无重阴影
- 最多一个极浅的空间层次阴影仅用于 runtime 浮层与背景分离；幻灯片本体仍禁止 shadow

## 6. 文字显现

不要传统“打字机一个字一个字蹦”。标准 runtime 使用**词/短语级柔和显现**：

- opacity 0→1
- translateY 4–6px→0
- blur 2px→0
- 单 token 约 220–320ms
- token 间隔约 18–28ms，总时长封顶约 1.3s
- 新段落可额外延迟 100–160ms

这使文字像教授边指图边自然说出来，而不像 AI 正在生成。

`prefers-reduced-motion` 时直接显示。
