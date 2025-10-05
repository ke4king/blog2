---
title: '几乎免费使用的Agent AI教程'
description: '开源AI代理Gemini CLI，将Gemini的强大能力直接注入您的终端。它提供轻量级访问通道，让您的指令直达模型核心。'
publishDate: '2025-06-28'
heroImage: {
    src: './9YNQZ5ahvr9RyNlZKU6pwFkr6GOlr9bv.webp'
}
---

## 什么是 Gemini CLI？

开源AI代理Gemini CLI，将Gemini的强大能力直接注入您的终端。它提供轻量级访问通道，让您的指令直达模型核心。虽然擅长编程辅助，但Gemini CLI的潜力远不止于此——这款本地化多功能工具可胜任内容生成、问题解决、深度研究及任务管理等各类场景。  

Gemini CLI预览版提供从代码解析、文件操作到命令执行与动态排障的全方位AI能力，通过自然语言实现代码编写、问题调试与工作流优化，带来革命性的命令行体验。

其核心能力包括：

- **谷歌搜索实时联网**：获取网页内容为模型提供外部上下文
- **扩展支持**：通过Model Context Protocol（MCP）或扩展组件增强功能
- **指令定制**：根据需求个性化调整工作流
- **自动化集成**：在脚本中非交互式调用实现任务自动化  
- ***Gemini CLI提供业界最大免费限额：每分钟 60 次请求，每日 1000 次调用。***

想象一下，你可以直接在电脑的“小黑窗”（也就是**终端**或**命令行界面**）里，用打字的方式和强大的人工智能 Gemini 对话，让它帮你写代码、分析文件、甚至自动化处理繁琐任务。**Gemini CLI** (Command-Line Interface) 就是实现这一切的官方工具。

![CleanShot 2025-06-26 at 11.24.00@2x.png](https://img.keye.wang/blog/247a49fb95374a5ca24fb4f8b434af49.webp)


### 命令行界面 (CLI)

这是一个**纯文本**的操作环境。你通过输入命令来告诉电脑做什么。它非常高效、强大，是程序员和技术爱好者的必备工具。

### 图形用户界面 (GUI)

这是你平时最熟悉的界面，比如 Windows 或 macOS 桌面，有**图标、窗口和按钮**。你通过点击鼠标来操作电脑。

---
## 安装与配置 (一步一步来)

让我们开始动手吧！只需三个简单步骤，你就可以启动你的 AI 助手。

### 第一步：安装前提 (Node.js)

Gemini CLI 需要一个名为 **Node.js** 的环境来运行。你可以把它理解为让 Gemini CLI 能够在你电脑上跑起来的基础软件。

*   **检查是否已安装：**打开你的终端（在 Windows 上是 PowerShell 或命令提示符，在 Mac 上是 Terminal），输入以下命令并按回车：

```bash
node -v
```

如果显示出 `v18.0.0` 或更高的版本号，恭喜你，可以跳到第二步！如果没有，或者提示“命令未找到”，请前往 [Node.js 官网](https://nodejs.org/)下载并安装 **LTS (长期支持)** 版本。


### 第二步：安装 Gemini CLI

你有两种方式来运行 Gemini CLI，我们**强烈推荐第二种**以便长期使用。

#### 快速体验 (npx)

这个命令会直接运行 Gemini CLI，但**不会**在你的电脑上永久安装它。适合想尝鲜的用户。

```bash
npx https://github.com/google-gemini/gemini-cli
```

#### 推荐：长期使用 (npm)

这个命令会将 Gemini CLI **全局安装**到你的系统中。之后，你只需输入 `gemini` 即可随时启动它。

```bash
npm install -g @google/gemini-cli
```

### 第三步：首次运行与授权

安装完成后，在终端里输入 `gemini` 并回车。首次运行时，它会引导你完成几个设置：

*   **选择颜色主题：**根据你的喜好为终端界面选择一个配色方案。
*   **登录谷歌账号：**它会提示你在浏览器中登录你的个人 Google 账号。这是为了授权 Gemini CLI 使用 Gemini 2.5 Pro 模型。放心，这个过程是安全的。

完成这些后，你就正式进入了 Gemini CLI 的交互世界！免费用户每天可以发出高达 1000 次请求，完全足够日常使用。
![CleanShot 2025-06-26 at 11.26.45@2x.png](https://img.keye.wang/blog/e361cce461694840acade004d565e881.webp)


- - -

## 你的第一个 AI 互动

启动 Gemini CLI 后，你会看到一个 `>` 符号，这表示它正在等待你的指令。现在，试着向它提问吧！

例如，让它帮你写一个 Python 函数来生成九九乘法表：

```bash
> 帮我写一个 Python 函数，可以打印出九九乘法表
```

Gemini 会立刻生成代码，并可能附带解释。你还可以继续追问，比如 `> 很好，现在给这段代码加上详细的注释`。它会记住上下文，并根据你的新要求修改代码。
![CleanShot 2025-06-26 at 11.27.56@2x.png](https://img.keye.wang/blog/ef6fdc1df324446d8739757ae754224f.webp)


## 探索更多实用功能

Gemini CLI 的强大之处在于它能理解你项目中的文件。你可以用它做很多酷炫的事情：

### 探索代码库

进入任何一个项目文件夹后，向它提问：`> 描述一下这个系统的主要架构。`

### 辅助编程

让它帮你完成具体任务：`> 为 GitHub issue #123 实现一个初步的解决方案。`

### 代码迁移

处理复杂的重构任务：`> 帮我把这个项目迁移到最新版本的 Java，先给我一个计划。`

### 文件处理

与你的文件系统交互：`> 把这个目录里所有的 jpg 图片转换成 png 格式。`

- - -

## 进阶配置 (可选)

如果你需要更高的请求额度或使用特定的 AI 模型，可以通过设置 **API 密钥** 来实现。

1.  首先，你需要从 [Google AI Studio](https://aistudio.google.com/) 获取你的 API 密钥。
2.  然后，在终端中设置一个环境变量。将 `YOUR_API_KEY` 替换成你自己的密钥。

```bash
# 在 Mac/Linux 上
export GEMINI_API_KEY="YOUR_API_KEY"

# 在 Windows (PowerShell) 上
$env:GEMINI_API_KEY="YOUR_API_KEY"
```

设置完成后，Gemini CLI 将会自动使用这个密钥进行认证。

---
## 常见问题

### 网络问题

#### 方式一：

开启***TUN模式***

#### 方式二：

编辑 ***~/.env***

```
HTTPS_PROXY="http://127.0.0.1:10086" 
HTTP_PROXY="http://127.0.0.1:10086"
```
### 账号问题

#### 切换账号  

如果卡住按ESC，有了输入框想切换/auth

#### 返回错误429

请不要使用API，目前登录 Google 账号不会触发429。

### 其他问题

如果在探索过程中遇到任何困难，别担心！官方提供了详细的文档和指南来帮助你。

前往 [Gemini CLI 官方 GitHub 仓库](https://github.com/google-gemini/gemini-cli)，你可以找到 **Troubleshooting guide (故障排查指南)** 和完整的 **CLI Commands (命令列表)**。

