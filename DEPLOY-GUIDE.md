# 本地 → GitHub → Cloudflare Pages 自动部署指南

> **适用于本项目**：环保纸钩官网（纯静态站点）
> **GitHub 仓库**：https://github.com/SWCX0101/eco-paper-hook
> **最后更新**：2026-11-19

---

## 整体流程图

```
你的电脑 (本地代码)
      │
      │  git push
      ▼
  GitHub 仓库 (SWCX0101/eco-paper-hook)
      │
      │  Cloudflare Pages 自动监听 push
      ▼
  Cloudflare Pages 自动构建 + 部署
      │
      ▼
  https://eco-paper-hook.pages.dev  ← 你的网站上线了
```

**核心原理**：你在本地改完代码，`git push` 到 GitHub，Cloudflare Pages 自动检测到推送，拉取代码、构建、部署——全程无需手动操作。

---

## 第一步：本地代码 → GitHub（已完成 ✅）

你的代码已经在这台机器的 `/workspace/eco-paper-hook-site`，并且已经推送到 GitHub。

### 以后每次修改后的标准操作

```bash
# 1. 进入项目目录
cd /workspace/eco-paper-hook-site

# 2. 修改文件后，添加到暂存区
git add -A

# 3. 提交（写清楚改了什么）
git commit -m "更新了场景页，新增 3 个使用场景"

# 4. 推送到 GitHub
git push
```

推送完成后，Cloudflare 会自动触发部署，通常 30-60 秒上线。

---

## 第二步：Cloudflare Pages 连接 GitHub（手动操作一次）

### 2.1 登录 Cloudflare

1. 打开 https://dash.cloudflare.com
2. 登录你的 Cloudflare 账号

### 2.2 创建 Pages 项目

1. 左侧菜单点击 **Workers & Pages**
2. 点击 **Create** → 选择 **Pages** 标签
3. 点击 **Connect to Git**

### 2.3 连接 GitHub

1. 选择 **GitHub** 作为 Git 提供商
2. 授权 Cloudflare 访问你的 GitHub 账号
3. 选择仓库 **SWCX0101/eco-paper-hook**
4. 点击 **Begin setup**

### 2.4 构建配置（关键！）

按下表填写：

| 配置项 | 填写内容 | 说明 |
|---|---|---|
| **Project name** | `eco-paper-hook` | 会成为域名前缀 |
| **Production branch** | `main` | 主分支 |
| **Framework preset** | `None` | 纯静态站点，无需预设 |
| **Build command** | （留空） | 不需要构建步骤 |
| **Build output directory** | `/` 或 `.` | 根目录就是输出目录 |
| **Root directory** | `/` | 默认根目录 |

> **重要**：Build command 必须留空！本项目是纯静态 HTML，不需要任何编译。

### 2.5 环境变量（本项目不需要）

本项目没有环境变量需求，直接跳过。

### 2.6 点击 Save and Deploy

Cloudflare 会立即进行第一次部署。部署完成后你会看到：

```
https://eco-paper-hook.pages.dev
```

这就是你的网站地址，可以直接打开访问。

---

## 第三步：验证自动部署

### 测试流程

1. 在本地修改任意文件，比如改个标题
2. `git add -A && git commit -m "test auto deploy" && git push`
3. 回到 Cloudflare Dashboard → Workers & Pages → eco-paper-hook
4. 你会看到一个新的部署任务自动开始
5. 状态变成 **Success** 后，刷新网站，改动已生效

---

## 第四步（可选）：绑定自定义域名

如果你有自己的域名（比如 `www.example.com`）：

1. 进入 Cloudflare Pages 项目 → **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按提示添加 CNAME 记录指向 `eco-paper-hook.pages.dev`
5. DNS 生效后即可通过自定义域名访问

---

## 日常更新速查

| 操作 | 命令 / 步骤 |
|---|---|
| 修改代码后上线 | `git add -A && git commit -m "说明" && git push` |
| 查看部署状态 | Cloudflare Dashboard → Workers & Pages → eco-paper-hook → Deployments |
| 回滚到旧版本 | Cloudflare Dashboard → 找到历史部署 → 点击 **Rollback to this deployment** |
| 查看部署日志 | Cloudflare Dashboard → 点击某次部署 → 查看构建日志 |
| 预览某次提交 | Cloudflare 会为每次推送生成一个预览链接（非 main 分支） |

---

## 常见问题

### Q: 推送后 Cloudflare 没有自动部署？

检查：
1. Cloudflare Dashboard 里 GitHub 连接是否还有效（Settings → Git）
2. 推送的是不是 `main` 分支（只有 main 分支会触发生产部署）
3. 部署日志里有没有报错

### Q: 部署成功但页面空白？

检查 Build output directory 是否设置为 `/`。本项目根目录就是输出目录。

### Q: 图片不显示？

确认图片路径是 `assets/img/xxx.jpg`（相对路径），不要用绝对路径 `/assets/img/xxx.jpg`。

### Q: 如何同时维护预览和生产环境？

- 推送到 `main` 分支 → 生产环境（`eco-paper-hook.pages.dev`）
- 推送到其他分支（如 `dev`）→ 预览环境（每次生成临时预览链接）

---

## 项目文件结构

```
eco-paper-hook/
├── index.html          首页
├── eco.html            环保主张
├── products.html       产品中心
├── custom.html         定制服务
├── cases.html          应用场景（12 个场景 + 行业对照表）
├── about.html          工厂实力
├── contact.html        联系我们（含询价表单）
├── assets/
│   ├── style.css       共享样式
│   ├── main.js         共享脚本
│   └── img/            12 张配图
├── wrangler.toml       Cloudflare 配置文件
├── .gitignore
└── README.md           项目说明
```

---

## 总结：三句话记住整个流程

1. **本地改代码** → `git add -A && git commit -m "说明" && git push`
2. **GitHub 接收推送** → Cloudflare 自动检测到变更
3. **Cloudflare 自动部署** → 30-60 秒后网站更新
