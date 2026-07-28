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
