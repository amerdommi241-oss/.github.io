---
title: OpenClaw 从零到一搭建教学：手把手教你拥有专属 Telegram AI 助手
date: 2026-03-01 12:00:00
tags: [科学上网知识库, 科学上网, 机场推荐, 翻墙, 科学上网教程, OpenClaw教程, 开源客户端, 抓取节点]
categories: [科学上网知识库]
---

如果你想把 AI 助手直接集成到 Telegram 或 Discord 中，告别频繁切换网页的烦恼，那么这篇教程正是为你准备的。我们将按照「环境准备 → 快速安装 → 核心配置 → 故障排查 → 安全加固」的路径，带你打造属于自己的高可用 AI 网关。




## OpenClaw 是什么？

OpenClaw 可以被视为一个本地运行的 **AI 智能网关**：



* **中转服务**：在你的设备上运行 Gateway 服务。

* **多端连接**：向上对接 Telegram、Discord、WhatsApp 等主流聊天平台。

* **模型聚合**：向下连接 GPT-4、Claude 3.5、DeepSeek 等顶级大模型。

* **极速交互**：你在聊天软件发送指令，Gateway 实时调用模型并返回结果。




**它适合谁？**



* 希望在社交软件中随时随地调用 AI 能力的用户。

* 追求极致效率，不想在多个 AI 网页和客户端间跳转的人群。

* 重视个人配置安全和工作流可控性的进阶用户。





[!TIP]
如果你是纯新手，建议先了解[科学上网基础知识](https://clashmac.cn.com/categories/%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91%E7%9F%A5%E8%AF%86%E5%BA%93/)，确保网络环境通畅后并在继续。



---


## 开始前准备

在正式动手前，请确保具备以下基础条件：


### 1. 系统环境


* **macOS**：原生支持，体验最佳。

* **Windows**：强烈建议配合 **WSL2 (Ubuntu 22.04)** 使用，虽然 Windows 下可运行，但 Linux 环境的稳定性与兼容性更胜一筹。

* **Linux**：各大发行版本均可直接安装。




### 2. 模型 API

OpenClaw 本身不直接提供模型服务，你需要接入模型提供商。



* **新手建议**：优先选择按量计费的聚合方案（如 OpenRouter），可以快速低成本试错。

* **进阶建议**：流程跑通后，可根据稳定性需求接入官方 API。




### 3. 网络环境（核心关键）

Telegram 服务需要稳定的代理环境。请确保你的代理软件正常运行：



* **软件参考**：[机场推荐与软件使用指南](https://clashmac.cn.com/2026/02/20/airport-recommendations/)。




**终端快速验证：**
在终端执行以下命令，若返回 200 或 301/302，则说明网络链路正常：


1
curl -I https://api.telegram.org



---


## 安装 OpenClaw

### Step 1：安装 Node.js
OpenClaw 要求 Node.js 版本 **>= 22**。请先检查版本：


1
2
node --version
npm --version



### Step 2：一键安装
推荐使用官方提供的快速安装脚本：


1
curl -fsSL https://openclaw.ai/install.sh | bash

安装完成后，验证是否成功：


1
openclaw --version



### Step 3：初始化与守护进程
为了保证服务后台常驻且重启自启，请运行：


1
openclaw onboard --install-daemon



---


## 首次配置流程

### 1. 模型提供商设置
在向导中，如果你已有官方 Key，按提示授权；若使用第三方 API，可先选择 Skip，等稍后通过 Web UI 详细配置。


### 2. 聊天平台对接

新手建议首选 **Telegram (Bot API)**，配置最简单且文档丰富。



* 若尚未注册，可参考：[Telegram 注册使用完全教程](https://clashmac.cn.com/2026/03/01/telegram-guide/)。




### 3. 创建 Telegram Bot

* 在 Telegram 搜索并关注 @BotFather。

* 发送 /newbot，按照提示设置名称和唯一用户名。

* 复制生成的 **API Token**（形如 123456:xxxx），粘贴回 OpenClaw 配置界面。



---


## 配置第三方模型（以 OpenRouter 为例）

### 推荐方式：Web UI

访问本地管理地址：http://127.0.0.1:18789


* 进入 Settings -> Models -> Add Provider。

* **Provider Name**：openrouter

* **Base URL**：https://openrouter.ai/api/v1

* **API Key**：粘贴你的密钥。

* **Model ID**：例如 anthropic/claude-3.5-sonnet 或 google/gemini-pro-1.5。




[!NOTE]
更多关于 DeepSeek 或 Gemini 的使用技巧，可参考：[Gemini 在中国使用指南](https://clashmac.cn.com/2026/02/20/gemini-in-china/)。



---


## 故障排查与代理设置

如果 Bot 没有响应，通常是由于环境变量未映射代理导致的。


### 代理环境变量

根据你的本地代理端口（如 7890），编辑 shell 配置文件（如 ~/.zshrc 或 ~/.bashrc）：


1
2
3
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890

生效并重启服务：


1
2
source ~/.zshrc
openclaw restart



---


## 安全与成本建议

* **预算上限**：务必在模型后台设置每日消费限额。

* **安全权限**：对涉及系统执行（exec）或邮件发送的工具启用 approvalRequired: true。

* **本地访问**：Gateway 建议仅监听本地 127.0.0.1，避免暴露到公网。



## 写在最后
OpenClaw 的强大之处在于它极大地缩短了你与 AI 之间的距离。通过将 AI 助手融入 Telegram，你的工作流程将变得更加丝滑。



📌 **本站相关文章推荐：**



* [2026 优质机场推荐（高速稳定）](/2026/02/20/airport-recommendations/)

* [Telegram 注册与安全设置全攻略](/2026/03/01/telegram-guide/)

* [海外服务接码平台指南](/2026/03/01/sms-verification-platforms/)