const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'source', '_posts', 'airport-recommendations.md');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Update the top table
let tableRegex = /## 2026年翻墙机场推荐一览表[\s\S]*?\| 极连云 \| 8元 60G\/月 \| \[注册\]\(https:\/\/xnfer01\.jlcvipaff\.cc\/#\/\?code=KUkfOY13\) \|/;
content = content.replace(tableRegex, `## 2026年翻墙机场推荐一览表

| 机场名称 | 最低月费 | 官网 |
|---------|---------|------|
| 极连云 | 8元 60G/月 | [注册](https://xnfer01.jlcvipaff.cc/#/?code=KUkfOY13) |
| 瞬云机场 | 8.25元 59G/月(年付) | [注册](https://syjccloud.com/#/register?code=SWAVvMOV) |
| 光年梯 | 18元 110G/月 | [注册](https://gnt001.gntvipaff.cc/#/?code=j1ufpE44) |`);

// Remove "光年梯" row from the table where it currently exists
content = content.replace(/\| 光年梯 \| 18元 110G\/月 \| \[注册\]\(https:\/\/gnt001\.gntvipaff\.cc\/#\/\?code=j1ufpE44\) \|\n/, '');

// 2. Extract "光年梯" block
// It starts at "### 8. 光年梯" and goes up to "### 9. 星岛梦"
const gntRegex = /(### 8\. 光年梯[\s\S]*?)(?=### 9\. 星岛梦)/;
const gntMatch = content.match(gntRegex);
let gntBlock = '';
if (gntMatch) {
    gntBlock = gntMatch[1].replace(/### 8\. 光年梯/, '### 3. 光年梯');
    content = content.replace(gntMatch[0], ''); // remove it from the old location
}

// 3. Insert "瞬云机场" and "光年梯" after "极连云" block
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

// We inject right before "### 2. 隐云"
content = content.replace(/(### 2\. 隐云)/, `${shunyunBlock}${gntBlock}$1`);

// 4. Renumber all the headings in the detailed section
// Ensure we don't accidentally match something else, so we look for "### <number>. "
let inDetailsSection = false;
let counter = 1;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## 好用的机场详细评测')) {
        inDetailsSection = true;
    }
    if (inDetailsSection && lines[i].match(/^### \d+\. /)) {
        lines[i] = lines[i].replace(/^### \d+\. /, `### ${counter}. `);
        counter++;
    }
}
content = lines.join('\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Update finished! Replaced correctly.');
