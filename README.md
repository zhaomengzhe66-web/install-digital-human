# Install Digital Human

[![Validate](https://github.com/zhaomengzhe66-web/install-digital-human/actions/workflows/validate.yml/badge.svg)](https://github.com/zhaomengzhe66-web/install-digital-human/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/skill-MIT-2f855a.svg)](LICENSE)
[![VRM](https://img.shields.io/badge/avatar-VRM%200.x%20%2F%201.0-236aa1.svg)](https://vrm.dev/)

一个面向 Codex、Claude Code 等编程智能体的网页数字人安装技能。它把已经发布的 VRM 数字人 Manifest 接入静态 HTML、Astro、React、Next.js 或 Vue 网站，并要求智能体完成实际构建、桌面端与 390px 响应式检查。

> English summary: a reusable agent skill for installing a Manifest-driven VRM assistant into an existing website, with explicit licensing, security, responsive, and browser-QA boundaries.

## 在线效果

- 音悦页面：<https://zaomeng.ing/sound/>
- 数字人工作台：<https://zaomeng.ing/digital-human/workbench.html>
- 嵌入运行时：<https://zaomeng.ing/digital-human/widget/digital-human.js?v=1.3.3>（带版本参数，避免旧缓存）

## 它解决什么问题

把一个 VRM 放进网页并不只是插入 Canvas。实际集成通常还需要处理：

- VRM 0.x / 1.0 的骨骼、表情和方向差异；
- 模型、动作、表情与菜单之间的 Manifest 映射；
- Shadow DOM 与 iframe 隔离；
- 模型和 VRMA 的跨域访问；
- Astro ClientRouter 等客户端路由造成的重复初始化；
- 桌面端、390px 移动端、键盘和减少动态效果模式；
- 模型作者、再分发、修改与商业使用范围。

这个技能把上述边界写进可复用的代理工作流，使“接入数字人”成为一次可验证的工程任务，而不是复制一段未经检查的脚本。

## 当前能力

- 默认固定在网页左下角，也可切换右下角；按住数字人本体即可拖到视口内任意位置，靠近边缘时控制面板会自动避让；
- 人物渲染层与命中层解耦，透明画布不会再把模型裁切在小矩形框里；滚轮支持连续缩放，视线跟随同时接收指针坐标；
- 视线与头部跟随指针；
- 五种跨 VRM 0.x / 1.0 校正后的程序化动作（挥手、欢呼、点头、摇头、鞠躬）与 VRMA 动作入口；
- 六种可配置情绪表情（自然、开心、生气、难过、放松、惊讶）及渐入、保持、渐出时长；
- 站立与持续坐姿；
- 气泡、问候、口型和宿主页面命令；
- `latest.json` 自动更新或固定版本 Manifest；
- 菜单按“视线跟随 / 动作 / 表情 / 其他”分组，动作与表情默认收起；点击动作后，右侧会生成按顺序递进的行为流程卡；
- 静态 HTML、Astro、React/Vite、Next.js、Vue 接入说明；
- 构建、资源、CORS、桌面端和 390px 浏览器自检。

## 工作方式

```text
工作台发布版本
      │
      ├── manifest.json  ── 动作 / 表情 / 菜单 / 行为 / 权限
      ├── avatar.vrm     ── 版本化模型
      └── *.vrma / audio ── 可选资源
                │
                ▼
<digital-human-assistant manifest="…">
                │
                ▼
宿主网页左下角的独立数字人
```

宿主网站只保存 Manifest 地址。使用 `latest.json` 时，工作台的新发布或回滚可以自动传播；使用不可变版本地址时，宿主页面只有重新部署代码才会更换角色版本。

## 安装为 Codex Skill

### Windows PowerShell

```powershell
git clone https://github.com/zhaomengzhe66-web/install-digital-human.git "$env:CODEX_HOME\skills\install-digital-human"
```

如果没有设置 `CODEX_HOME`：

```powershell
git clone https://github.com/zhaomengzhe66-web/install-digital-human.git "$HOME\.codex\skills\install-digital-human"
```

### macOS / Linux

```bash
git clone https://github.com/zhaomengzhe66-web/install-digital-human.git \
  "${CODEX_HOME:-$HOME/.codex}/skills/install-digital-human"
```

重新启动 Codex 或刷新技能列表后，可以直接说：

```text
使用 $install-digital-human，把这个 Manifest 接到当前 Astro 网站左下角，并完成桌面端和 390px 自检：
https://zaomeng.ing/digital-human/published/site-guide/latest.json
```

## 最小网页接入

```html
<script
  type="module"
  src="https://zaomeng.ing/digital-human/widget/digital-human.js?v=1.3.3"
></script>

<digital-human-assistant
  manifest="https://zaomeng.ing/digital-human/published/site-guide/latest.json"
  position="bottom-left"
  remember-state
  remember-position
></digital-human-assistant>
```

点击数字人会打开或关闭菜单；按住数字人本体并移动超过 6px 才会拖动，菜单中不再需要单独的拖动按钮。键盘聚焦数字人后可用方向键微调位置，`Shift` 加方向键会加大步进。人物区域上的鼠标滚轮可连续缩放（透明渲染面会随之放大，不再被小框裁切），视线跟随会继续接收拖动层转发的指针坐标。

面板默认锚定在人物右上方并保持收起。打开后，动作、表情和其他分组仍按需展开；每次点击行为都会在面板右侧加入一个流程步骤，状态会从“排队”更新为“正在执行”再到“已完成”。人物靠近右侧边缘时，面板会翻转到人物左侧以保持可见。

组件公开方法包括：

```js
await customElements.whenDefined('digital-human-assistant');

const assistant = document.querySelector('digital-human-assistant');
assistant.setState('listening');
assistant.setGazeFollow(true);
assistant.playAction('wave');
assistant.setExpression('happy');
assistant.setPose('curled-sit');
assistant.showBubble('一起听吧。');
assistant.resetPosition();
```

拖动完成和键盘调整都会触发 `digital-human-positionchange`，事件详情包含 `left`、`top` 与 `source`。设置 `movable="false"` 可为特定页面禁用拖动。

更多框架放置说明见 [`references/frameworks.md`](references/frameworks.md)。

## Manifest 选择

自动跟随工作台更新：

```html
<digital-human-assistant
  manifest="https://zaomeng.ing/digital-human/published/sound-resident/latest.json"
></digital-human-assistant>
```

锁定不可变版本：

```html
<digital-human-assistant
  manifest="https://zaomeng.ing/digital-human/published/sound-resident/versions/1.0.0/manifest.json"
></digital-human-assistant>
```

推荐内容型、持续运营的网站使用 `latest.json`；需要严格复现和变更审计的产品版本使用不可变地址。

## 本仓库示范

仓库打包了两个实际 VRM 文件：

| 模型 | 版本 | 用途 | 许可提示 |
| --- | --- | --- | --- |
| Xia Yu Yao 耳机角色 | VRM 0.x | 音悦页面的完整动作与表情示范 | 仅非商业示范；允许再分发；以模型内嵌许可为准 |
| VRM1 Constraint Sample | VRM 1.0 | 新版骨骼、LookAt、SpringBone 与约束兼容测试 | 以模型内嵌 VRM 1.0 许可为准 |

完整声明、来源和哈希见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。仓库的 MIT 许可证**不覆盖第三方模型**。

运行本地示范：

```bash
npm run demo
```

然后打开 <http://127.0.0.1:4173/examples/>。示例页面允许在 VRM 0.x 和 VRM 1.0 之间切换，并直接打开已校正的动作、表情、视线与坐姿菜单；按住角色本体即可移动。

## 验证

```bash
npm test
```

验证脚本会检查：

- 技能入口、UI 元数据和参考文档完整；
- Manifest 基本结构和菜单上限；
- 示例 Manifest 指向仓库内真实模型；
- 两个 VRM 文件的 SHA-256 未发生意外变化；
- `openai.yaml` 的默认提示正确包含 `$install-digital-human`。

真实网站交付前还必须人工或通过浏览器自动化检查：

1. Manifest、模型、动作和音频资源均返回 200；
2. 至少触发一个动作和一个表情；
3. 视线跟随、动作/表情可折叠分组、滚轮缩放、坐下/站起、Escape、收起/恢复和直接拖动正常；
4. 桌面端和 390px 无横向溢出，菜单不离开视口；
5. 客户端路由来回切换后只有一个数字人实例；
6. 控制台没有错误。

## 安全与许可

- Manifest 是数据，不是代码；运行时只执行白名单命令。
- 不把令牌、私有模型地址或创作者凭据写入客户端。
- 不为解决 CORS 而代理来源不明的私有资源。
- VAM `.var` 不能改后缀直接当作 VRM 使用。
- 发布前检查模型内嵌许可和作者链接；“仓库公开”不等于“所有模型可商用”。

VRM 1.0 规范将头像使用者、商业用途、再分发、修改、署名等作为独立许可字段，因此每个模型都必须单独判断，而不能继承代码仓库的 MIT 许可。

## 后续更新与同步

这个仓库是技能的公开上游。后续改进建议直接在本地克隆目录完成：

```bash
git pull --ff-only
npm test
git add SKILL.md agents references scripts examples README.md
git commit -m "feat: describe the improvement"
git push origin main
```

发布前建议同步完成三件事：更新 `CHANGELOG.md`、运行 `npm test`、在真实网站完成桌面端和 390px 检查。这样技能说明、示例 Manifest、模型声明和 GitHub 仓库会保持在同一个版本历史中。

## 开源协议

技能、脚本与仓库原创文档采用 [MIT License](LICENSE)。第三方 VRM 文件遵循各自内嵌许可和 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
