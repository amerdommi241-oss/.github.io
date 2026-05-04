const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'source', '_posts', 'airport-recommendations.md');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update the table
let tableRegex = /## 2026年翻墙机场推荐一览表[\s\S]*?\| 极连云 \| 8元 60G\/月 \| \[注册\]\(https:\/\/xnfer01.jlcvipaff.cc\/#\/\?code=KUkfOY13\) \|/;
content = content.replace(tableRegex, `## 2026年翻墙机场推荐一览表

| 机场名称 | 最低月费 | 官网 |
|---------|---------|------|
| 极连云 | 8元 60G/月 | [注册](https://xnfer01.jlcvipaff.cc/#/?code=KUkfOY13) |
| 瞬云机场 | 8.25元 59G/月(年付) | [注册](https://syjccloud.com/#/register?code=SWAVvMOV) |
| 光年梯 | 18元 110G/月 | [注册](https://gnt001.gntvipaff.cc/#/?code=j1ufpE44) |`);

// remove 光年梯 from the table lower down
content = content.replace(/\| 光年梯 \| 18元 110G\/月 \| \[注册\]\(https:\/\/gnt001\.gntvipaff\.cc\/#\/\?code=j1ufpE44\) \|\n/, '');

// 2. Extract 光年梯 block
const gntRegex = /(### \d+\. 光年梯[\s\S]*?)---/;
const gntMatch = content.match(gntRegex);
let gntBlock = '';
if (gntMatch) {
    gntBlock = gntMatch[1].replace(/### \d+\. 光年梯/, '### 3. 光年梯');
    // Remove the old 光年梯 block
    content = content.replace(gntMatch[0], '');
}

// 3. Insert 瞬云机场 and 光年梯 after 极连云
const shunyunBlock = `### 2. 瞬云机场

瞬云机场官网地址：[syjccloud.com](https://syjccloud.com/#/register?code=SWAVvMOV)

最便宜的订阅有 **8.25元 59G/月（年付）**。

瞬云机场支持解锁各大流媒体，解锁 ChatGPT、Gemini 等 AI 服务，轻松满足跨境电商、直播运营、远程办公及日常冲浪等多场景需求。网络采用直连加专线架构，搭配主流国家 ANYCAST 高速节点，确保连接的低延迟与高稳定性。套餐均承诺无倍率、不限速，且价格透明实在，是专线路线中不可多得的高性价比之选。

**特色功能**

* 直连+全节点专线加速，采用 ANYCAST 高速节点，低延迟稳定连接
* 完美解锁 Netflix、Disney+ 等流媒体及 ChatGPT、Gemini 等 AI 平台
* 采用底层稳定的协议，安全可靠，保护用户隐私
* 全线套餐无倍率、不限制峰值速率（不限速）
* 规范设备限制（仅限个人使用），严格把控滥用，保障整体网络环境的高质量

| 套餐名称 | 流量 | 价格 | 说明 |
| :--- | :--- | :--- | :--- |
| **限时年付小包** | 59G/月 | ¥ 99.00/年 | 限时套餐，随时下架（折合约 ¥8.25/月）。仅限个人使用，不限速，ANYCAST 高速节点 |
| **行者** | 150G/月 | ¥ 20.00/月 | 适合日常轻中度使用。仅限个人使用，不限速，ANYCAST 高速节点 |
| **縱橫** | 300G/月 | ¥ 36.00/月 | 适合大多数流媒体爱好者。仅限个人使用，不限速，ANYCAST 高速节点 |
| **凌霄** | 600G/月 | ¥ 68.00/月 | 大流量及重度办公/下载需求首选。仅限个人使用，不限速，ANYCAST 高速节点 |

[👉 立即注册瞬云机场](https://syjccloud.com/#/register?code=SWAVvMOV)

---

`;

const jlyRegex = /(### 1\. 极连云[\s\S]*?---\n\n)/;
content = content.replace(jlyRegex, `$1${shunyunBlock}${gntBlock}---\n\n`);

// 4. Renumber all the headings
let counter = 1;
content = content.replace(/### (\d+)\. /g, (match, p1) => {
    return `### ${counter++}. `;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update finished!');
