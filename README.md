# 一本通样例复制助手

一个专为信息学奥赛一本通在线评测系统（ybt.ssoier.cn）开发的浏览器扩展，用于快速复制题目的输入/输出样例。

## 🚀 快速安装

### 方法一：GitHub Releases（稳定版）

访问 [GitHub Releases](https://github.com/PhantomPixel-0418/ybt-copy-helper/releases) 下载最新稳定版的 `ZIP` 文件。

### 方法二：GitHub Actions（最新开发版）

访问 [GitHub Actions](https://github.com/PhantomPixel-0418/ybt-copy-helper/actions) 页面，选择最新的工作流运行，在 **Artifacts** 部分下载最新的构建文件。

### 方法三：从源码安装（开发者）

```bash
# 克隆仓库
git clone https://github.com/PhantomPixel-0418/ybt-copy-helper.git
cd ybt-copy-helper

# 在浏览器中加载扩展
# Chrome: chrome://extensions/ → 开启"开发者模式" → "加载已解压的扩展程序"
# Edge: edge://extensions/ → 开启"开发人员模式" → "加载解压缩的扩展"
```

## 📦 构建文件说明

| 文件类型 | 用途 | 下载位置 |
|---------|------|----------|
| `.zip` 文件 | 扩展程序压缩包，解压后可在浏览器中加载 | Releases 或 Actions Artifacts |
| `ybt-copy-helper-*` 目录 | 已解压的扩展程序文件夹 | Actions Artifacts |

### 如何使用构建文件

1. **从 Releases/Actions 下载 ZIP 文件**
2. **解压 ZIP 文件**到本地目录
3. **打开浏览器扩展管理页面**：
   - Chrome：`chrome://extensions/`
   - Edge：`edge://extensions/`
4. **开启开发者模式**
5. **点击"加载已解压的扩展程序"**（Chrome）或"加载解压缩的扩展"（Edge）
6. **选择解压后的文件夹**

## 功能特性

- 🔄 **自动识别**：自动检测页面中的输入/输出样例区域
- 🎯 **精准定位**：智能算法确保只在样例框添加复制按钮
- 📋 **一键复制**：点击按钮即可复制样例内容到剪贴板
- 🎨 **美观反馈**：提供视觉反馈，显示复制状态
- 🔧 **高度兼容**：支持 Chrome 和 Edge 浏览器最新版本
- ⚡ **轻量快速**：不影响页面加载速度
- 🔄 **持续更新**：每次提交自动构建，紧急修复快速可用

## 使用说明

1. 访问任意一本通题目页面，如：[1000：入门测试题目](http://ybt.ssoier.cn:8088/problem_show.php?pid=1000)
2. 页面加载完成后，每个样例框右上角会出现紫色渐变"复制"按钮
3. 点击按钮即可复制对应样例内容
4. 按钮会短暂变为"✓ 已复制"提供反馈

## 插件原理

插件通过以下策略识别样例区域：

1. **查找所有`<pre>`标签**：样例通常使用 `pre` 元素显示
2. **内容过滤**：排除文本过短或没有换行的元素
3. **上下文分析**：查找包含"输入样例"或"输出样例"文本附近的 `pre` 元素
4. **智能去重**：避免重复添加按钮

## 文件结构

```
ybt-copy-helper/
├── .github/workflows/     # GitHub Actions 配置
│   └── build.yml          # 自动构建工作流
├── dist/                  # 构建输出目录（自动生成）
├── README.md              # 说明文档
├── manifest.json          # 插件配置文件
├── content.js            # 核心功能脚本
├── icon.png              # 插件图标
└── screenshot.png        # 插件效果截图
```

## 开发指南

### 自定义样式

如需修改按钮外观，编辑 `content.js` 中的按钮样式部分：

```javascript
copyBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10000;
    padding: 4px 12px;
    /* 修改以下属性自定义样式 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 4px;
    /* ... */
`;
```

### 调试插件

1. 在题目页面按 `F12` 打开开发者工具
2. 在 Console 面板查看插件日志
3. 使用以下命令手动测试：

    ```javascript
    // 查看所有pre元素
    document.querySelectorAll('pre').forEach((pre, i) => {
        console.log(`pre[${i}]:`, pre.textContent);
    });
    ```

## 🐛 报告问题与紧急修复

### 发现错误？

1. **检查 Actions 构建**：最新修复可能已在 Actions 中可用
2. **提交 Issue**：在 GitHub Issues 中报告问题
3. **紧急修复**：开发者会尽快修复并推送到主分支

### 获取最新修复

每次提交到主分支都会触发自动构建，您可以在：

- **GitHub Actions** → 最新工作流运行 → **Artifacts**
- 下载 `ybt-copy-helper-build` 获取最新修复版本

## 常见问题

### Q: 按钮没有显示？

**A:** 请检查：

1. 插件是否已启用（Chrome：`chrome://extensions/`，Edge：`edge://extensions/`）
2. 是否在正确的域名（ybt.ssoier.cn:8088）
3. 页面是否完全加载（样例可能动态加载）
4. 尝试从 Actions 下载最新构建版本

### Q: 点击按钮无反应？

**A:** 可能是剪贴板权限问题：

1. 确认浏览器版本支持 Clipboard API
2. 检查控制台是否有错误信息
3. 更新到最新构建版本

### Q: 按钮位置不正确？

**A:** 不同题目页面结构可能不同，可以：

1. 在 GitHub 提交 Issue 并提供题目链接
2. 或自行调整选择器逻辑

## 持续集成状态

[![构建状态](https://github.com/PhantomPixel-0418/ybt-copy-helper/actions/workflows/build.yml/badge.svg)](https://github.com/PhantomPixel-0418/ybt-copy-helper/actions)

**最新构建下载**：[点击查看 Actions](https://github.com/PhantomPixel-0418/ybt-copy-helper/actions)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支

    ```shell
    git checkout -b feature/amazing-feature
    ```

3. 提交更改

    ```shell
    git commit -m 'Add some amazing feature'
    ```

4. 推送到分支

    ```shell
    git push origin feature/amazing-feature
    ```

5. 开启Pull Request

**注意**：每次推送到主分支都会自动构建，您可以在 Actions 页面查看构建状态和下载构建文件。

### Edge 商店（待发布）

*即将在 Microsoft Edge Add-ons 商店发布*

## 技术栈

- Vanilla JavaScript (ES6+)
- WebExtensions API (Manifest V3)
- Clipboard API
- MutationObserver API
- GitHub Actions（持续集成）

## 浏览器支持

- Google Chrome 88+
- Microsoft Edge 88+
- 理论上兼容所有支持 Manifest V3 的 Chromium 内核浏览器

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 免责声明

本插件为第三方工具，与"信息学奥赛一本通"官方无关。仅用于学习交流，请勿用于任何商业用途。

---

**提示**：使用本插件时请遵守网站使用规则，合理使用复制功能，建议在理解算法思路后自己编写代码。

**紧急修复**：如需最新修复版本，请访问 [GitHub Actions](https://github.com/PhantomPixel-0418/ybt-copy-helper/actions) 下载最新构建。
