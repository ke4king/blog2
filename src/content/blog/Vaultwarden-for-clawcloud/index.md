---
title: '利用 ClawCloud Run 的 Devbox 白嫖部署 Vaultwarden 密码管理软件'
description: '使用 ClawCloud 搭建一个开源免费的密码管理软件'
publishDate: '2025-05-03'
heroImage: {
    src: './ug3mGPalPo5olMso50krc6dEPSRbaHa7.webp'
}
---

## ClawCloud Run是什么

> Discover our powerful, user-friendly container hosting service — **APP Launchpad**—and our all-in-one development platform — **Devbox**. Designed for efficiency, these tools streamline your container management and application hosting projects.

> ClawCloud Run is a cloud development platform that integrates online development, testing, and production environments. With just a few clicks, set up your development environment and database dependencies—reducing complexity dramatically.

说人话：ClawCloud Run可以免费部署 Docker。
## 部署步骤

### 注意事项
 1. ClawCloud Run 有多个计划，我们如果只需要部署 vaultwarden 使用免费计划绰绰有余。
 2. ClawCloud Run 需要 Github 登录，且 GitHub 账户注册时间大于 180 天，否则只有第一个月赠送 5 美刀。注册时间大于 180 天是每个月赠送 5 美刀。
 3. 需要准备一个域名（子域名即可）。

### 注册
 ![image.png](https://img.keye.wang/blog/3dbc5388156d4ef4b084b42709c9575c.webp)
使用 GitHub 账户登录
### 创建容器及配置
 选择地区（一般选日本）后，点击 App Launchpad，Creat App。
 ![CleanShot 2025-05-02 at 07.44.10@2x.png](https://img.keye.wang/blog/a8f9afff501e40cfa978e46d65c8bcd2.webp)
####  Image Name

 ```
vaultwarden/server:latest
 ```
#### Network
```

端口 80，开启防落访问，并填写自定义域名，并 cname 解析过去。
```
#### Environment Variables
```
#去除本行及所有#注释
WEBSOCKET_ENABLED=true # 启用 WebSocket（可设为 false 降低内存）
LOG_LEVEL=warn  # 减少日志输出
ENABLE_ATTACHMENTS=false # 禁用附件，降低资源需求
DOMAIN=https://xxxx.com  # 替换为你的域名
```
## 为什么要使用vaultwarden（以下内容来自于 AI）
 1. 开源与自托管：Vaultwarden 是一个开源的 Bitwarden 服务器实现，允许用户自托管密码管理服务，拥有数据控制权，适合注重隐私和安全的企业或个人。
2. 轻量级：相比官方 Bitwarden 服务器，Vaultwarden 使用 Rust 编写，资源占用更低，适合在小型服务器或个人设备上运行。
3. 成本效益：自托管免除了订阅官方 Bitwarden 高级服务的费用，且 Vaultwarden 免费提供大部分功能。
4. 兼容性：完全兼容 Bitwarden 客户端，支持所有官方应用和浏览器扩展，无需改变用户习惯。

| **工具/服务**        | **开源性** | **托管方式** | **资源占用** | **成本**    | **隐私与控制**   | **团队功能**     | **用户体验** | **适合人群**      |
| ---------------- | ------- | -------- | -------- | --------- | ----------- | ------------ | -------- | ------------- |
| **Vaultwarden**  | 开源      | 自托管      | 低        | 免费        | 高（数据自控）     | 基本支持         | 一般       | 个人、小型团队、技术用户  |
| **Bitwarden 官方** | 部分开源    | 自托管或云托管  | 较高       | 免费/付费高级功能 | 中（云托管有隐私风险） | 丰富（支持 SSO 等） | 良好       | 个人、企业、团队      |
| **LastPass**     | 闭源      | 云托管      | 无需本地资源   | 免费/付费高级功能 | 低（隐私问题受关注）  | 丰富           | 良好       | 个人、团队、追求便捷用户  |
| **1Password**    | 闭源      | 云托管      | 无需本地资源   | 付费        | 中（依赖云服务）    | 丰富           | 优秀       | 个人、家庭、企业      |
| **KeePass**      | 开源      | 本地存储     | 低        | 免费        | 高（数据本地存储）   | 有限           | 一般       | 注重隐私、不需云同步的用户 |

