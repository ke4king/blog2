---
title: '我在 Cursor 的帮助下写了一个案件简报管理系统'
description: '最近案件比较多，案件的简报整理一直是一个比较头痛的问题。不同类型的案件需要的必要元素其实差距比较大'
publishDate: '2025-05-04'
heroImage: {
    src: './lL24F0WWUnfn5cNy63EzEvvMcHGx4sbj.webp'
}
---

## 起因
最近案件比较多，案件的简报整理一直是一个比较头痛的问题。不同类型的案件需要的必要元素其实差距比较大，比如在大部分赌博类案件中，客户更关注的是支付结算的数据；在黑灰产类的案件中客户更关注的是技术或老板的落地或溯源信息。思来想去，把一些必要性的要素提取出来，其他的元素在一个大框架下去补充。
## 技术选型
近几年来基本没有做过开发了，考虑服务器成本、安全、维护、开发周期的情况下，开始选用 Fast Api+Element Plus 这样的前后端架构，单用户，指定 IP 作为白名单可访问 Web（毕竟我自己就是搞安全的，Web 不可控因素太多） 。在生产环境部署的时候，突然想起 Cloudflare 大善人的 Cloudflare 的 Worker，立马重写了后端，部署到了 Cloudflare Worker。
## 功能
### 添加案件简报
![添加案件简报](https://img.keye.wang/blog/66a6acd2dae74e3c85918cc2975dcf45.webp)
### 管理案件简报
![管理案件简报](https://img.keye.wang/blog/b02926b6882d46bc84a94ca71eabb2ec.webp)
### 查看案件简报
![查看案件简报](https://img.keye.wang/blog/f3354ab6eacd44c0ab16d01ae50314bc.webp)
### 分享案件简报
![分享案件简报](https://img.keye.wang/blog/dcd21de534f6421e8c59b9dd69721478.webp)

### 导出案件简报
可以直接通过 HTML 转换成 PDF。
## Show Me You Code
之前提到过，最近几年没有做过开发了，平时最多写写 Python 脚本，所以拿起了 Cursor 来充当我的大哥。目前平台整体还不够完善，等今年有时间完成以下TODO再开源。
### Todolist
1. 完善数据库支持（MySQL、Sqlite3、Mongodb 等）。
2. 支持多用户，完善权限管理。
3. 登录仅支持现代化的 Passkey。
4. 支持 Docker 部署或 Cloudflare 一键部署（目前已完成未测试）。
5. 案件简报表单自定义，可视化定义不同案件类型的表单。
