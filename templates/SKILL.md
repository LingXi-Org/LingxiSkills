---
name: your-skill-name
description: Describe what this skill does and when an agent should use it.
license: MIT
compatibility: Works with LingxiGraph and Agent Skills compatible runtimes.
allowed-tools: read_skill_resource
metadata:
  author: your-name
  version: 0.1.0
  display-name: 你的 Skill 展示名称
  display-description: 用一句话描述面向用户的能力
---

# Your Skill Name

用简洁、可执行的语言描述这个 Skill 的目标。不要把运行时权限写进 Skill；授权、HITL、timeout 与预算由宿主运行时负责。

## 何时使用

- 当用户或上游 Agent 需要……时使用。
- 当任务不满足……时不要使用。

## 输入与上下文

说明完成任务需要哪些输入、学习证据、课程上下文或状态；缺失关键信息时如何降级。

## 执行步骤

1. 判断任务是否满足触发条件。
2. 读取必要的 `references/` 资源；不要一次性加载无关资料。
3. 如需确定性辅助逻辑，可读取 `scripts/`，但不要声称已执行脚本，除非宿主另行提供并授权执行工具。
4. 生成满足输出契约的结果。
5. 在证据不足或能力边界之外时明确降级或停止。

## 输出契约

说明最终输出的语言、结构、字段、格式或可验证条件。

## 资源

- `references/`：可选，放详细说明、契约和上下文。
- `scripts/`：可选，放确定性辅助脚本；LingxiGraph 读取它们但不会自动执行。
- `assets/`：可选，放模板、示例和其他可复用输出资源。

## 安全边界

- 不使用绝对路径或 `..` 访问资源。
- 不依赖 symlink、junction/reparse point 或特殊文件。
- 不把 `allowed-tools` 当作工具授权。
- 不绕过宿主的 ToolSpec、tool_authorize、HITL、timeout 或预算策略。
