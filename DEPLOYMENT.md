# www.lihancong.com 部署交接

当前状态：前端登录入口、受保护工作台、Supabase Auth 接口骨架和 GitHub Pages 自定义域名声明均已预部署。

## 2026-07-30 购买域名后

在阿里云购买 `lihancong.com` 后，进入：云解析 DNS → 权威解析 → `lihancong.com` → 解析设置。

### 1. www 子域

添加：

- 记录类型：`CNAME`
- 主机记录：`www`
- 记录值：`li-hancong.github.io`
- TTL：默认即可

### 2. 根域名

建议添加 GitHub Pages 官方 A 记录：

- `@` → `185.199.108.153`
- `@` → `185.199.109.153`
- `@` → `185.199.110.153`
- `@` → `185.199.111.153`

### 3. GitHub Pages

仓库已经包含：

`CNAME` → `www.lihancong.com`

购买并配置 DNS 后，到 GitHub 仓库 Settings → Pages 检查 Custom domain 是否为 `www.lihancong.com`，DNS 校验通过后开启 `Enforce HTTPS`。

## 启用真实登录

仓库的 `config.js` 已预留：

```js
supabaseUrl: "",
supabasePublishableKey: ""
```

创建 Supabase 项目后，只填写 Project URL 和 Publishable Key（或旧项目 anon key）即可。不要填写 `service_role`、secret key 或数据库密码。

Supabase Auth 的 Site URL 设置为：

`https://www.lihancong.com`

建议 Redirect URLs 至少允许：

`https://www.lihancong.com/**`

## 当前页面

- `/`：登录入口
- `/dashboard.html`：登录后的工作台，会检查 Session
- `/config.js`：公开前端配置，只允许放可公开的 Supabase URL 与 Publishable Key

## 安全原则

GitHub Pages 上的 HTML/CSS/JavaScript 都是公开资源。真正需要保护的数据必须通过 Supabase Auth + RLS 或其他后端权限控制读取，不能直接把敏感内容写在静态页面里。


## 2026-10-11：成考练习室

- 访问入口：https://www.lihancong.com/exam/
- 静态文件目录：exam/；不需要服务器或额外依赖。
- 原登录页与工作台各新增一个入口；Supabase认证代码与配置保持原样。
- 保留CNAME中的www.lihancong.com。根目录.nojekyll声明按静态资源发布。
- 题库：原创95道基础题（86道客观题、9道阅读简答）与4项写作训练。不是官方全真试卷。
- 客观题每题1分；主观题待人工批阅，不纳入自动分数。
- 使用方法：完成作答 → 提交 → 下载TXT → 将TXT上传给聊天中的老师。提交不会自动发送到聊天。
- 草稿与最近10份历史答卷只存当前浏览器的localStorage。跨设备使用前导出JSON，在新浏览器导入。原Sites网址的数据不会自动迁移到此域名。
- JSON备份恢复会验证题库版本、题号和答案格式；TXT仅用于人工批阅。
- GitHub Pages前端与题库公开；答卷不写入GitHub，不包含任何服务器密钥。
- 检查命令：node --check exam/app.mjs、node --check exam/core.mjs、node tests/exam.test.mjs。
- 发布沿用现有main分支的Pages流程；部署结果在Actions的pages build and deployment中查看。
