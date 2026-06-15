const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');

const titleMap = {
    'airport-custom-client-vs-clash-v2ray.md': '翻墙用哪款客户端？机场专属定制客户端对比开源Clash/V2Ray新手避坑指南',
    'airport-network-incident-2026.md': '2026稳定机场选购风向：国内广东机房拔线熔断大地震后，如何挑选抗封锁翻墙机场？',
    'airport-recommendations.md': '2026年稳定便宜专线机场推荐排行榜：高性价比科学上网梯子精选测评',
    'airport-routes-difference.md': '翻墙机场线路怎么选？直连、中转与IPLC/IEPL专线核心区别及优缺点深度对比',
    'airport-routes-selection.md': '新手如何根据线路选择翻墙机场？一文看懂直连、中转与IEPL专线梯子区别',
    'airport-speed-analysis.md': '翻墙机场测速防坑指南：单线程与多线程测速真相，别被机场测速图欺骗',
    'airport-vs-vpn.md': '科学上网用机场还是VPN？一文读懂翻墙机场与传统VPN的核心区别',
    'best-budget-airport-for-students.md': '2026学生便宜机场梯子推荐：月付10元靠谱翻墙节点与按量付费性价比对比',
    'chatgpt-mirrors-guide.md': '2026国内直连ChatGPT镜像网站完全使用指南（最新免费/免翻墙镜像站汇总）',
    'clash-meta-android-tutorial.md': '安卓科学上网教程：2026最新 Clash Meta for Android (Mihomo) 配置使用指南',
    'clash-party-tutorial.md': 'Clash Party 怎么用？2026最新 Clash Party 客户端配置与分流规则指南',
    'clash-verge-rev-tutorial.md': '2026最新 Clash Verge Rev 下载、安装与配置保姆级教程（Windows/Mac）',
    'clashmi-tutorial.md': 'Clash Mi 怎么配置？适配经典内核的高效科学上网客户端配置使用指南',
    'claude-guide.md': 'Claude国内怎么用？2026最新国内直连Claude镜像站与共享账号防封攻略',
    'determine-line-type.md': '翻墙进阶教程：如何识别真假IEPL/IPLC专线、CN2与BGP中转机场线路',
    'egern-tutorial.md': '苹果iOS科学上网：Egern 客户端配置使用教程与分流规则优化指南',
    'flclash-tutorial.md': 'FlClash怎么配置？2026最新跨平台代理客户端 FlClash 全平台配置使用指南',
    'gemini-in-china.md': 'Gemini在中国大陆怎么使用？2026最新谷歌AI科学上网与账号注册保姆级教程',
    'gfw-websites-guide.md': '2026国内翻墙后必看的墙外宝藏网站推荐：涵盖学术、AI、流媒体与社交平台',
    'grok-4-tutorial.md': 'Grok 4 国内怎么用？亮点功能、订阅对比与国内无限制使用保姆级教程',
    'how-to-choose-airport.md': '2026如何挑选翻墙机场？新手购买机场避坑、防跑路与防坑完全指南',
    'is-100gb-airport-data-enough.md': '机场流量100G够用吗？翻墙流量消耗测算与机场流量倍率防坑指南',
    'letsvpn-shutdown-2026.md': '快连VPN(LetsVPN)停运真相？2026国内广东机房拔线事件与抗封锁机场推荐',
    'midjourney-guide.md': 'Midjourney国内怎么用？2026最新国内访问与共享账号购买保姆级教程',
    'mobile-vpn-guide.md': '2026手机如何科学上网？Android与iOS双平台翻墙客户端配置推荐指南',
    'nekobox-tutorial.md': '安卓Nekobox(猫盒)怎么配置？2026最新 Nekobox 订阅与多协议使用教程',
    'netflix-guide.md': '2026国内如何看Netflix奈飞？解锁非温区、4K画质与原生机场节点推荐',
    'netflix-secret-classification.md': 'Netflix奈飞隐藏分类代码大全：如何一键解锁奈飞秘密电影库与特区内容',
    'openclaw-tutorial.md': '如何搭建OpenClaw？利用翻墙网络与API打造国内专属Telegram AI助手教程',
    'quantumult-x-tutorial.md': 'iOS圈X配置教程：2026最新 Quantumult X 节点订阅与重写分流规则指南',
    'router-vpn-setup-2026.md': '2026最新路由器翻墙配置指南：如何让全屋设备自动实现科学上网',
    'shadowrocket-v2-tutorial.md': 'iOS小火箭配置教程：2026最新 Shadowrocket 节点订阅与分流规则保姆级指南',
    'sms-verification-platforms.md': '2026国外接码平台评测推荐：免费与收费虚拟手机号接收短信验证码平台汇总',
    'soft-router-guide-2026.md': '什么是软路由？2026新手OpenWrt/爱快系统安装与软路由翻墙配置教程',
    'software.md': '2026最新科学上网客户端下载汇总：Windows/Mac/Android/iOS常用翻墙软件下载',
    'spotify-guide.md': 'Spotify Premium便宜购买合租攻略：最新Spotify账号注册、解锁与降级保姆教程',
    'streaming-accounts-guide.md': '2026流媒体合租平台推荐：便宜好用的Netflix/Spotify/ChatGPT合租平台评测',
    'telegram-guide.md': '2026最新 Telegram (电报) 注册、中文汉化与国内使用安全完全教程',
    'telegram-search-guide.md': 'Telegram电报怎么搜索资源？2026最新电报极搜群组、频道与机器人指南',
    'test-post.md': '从V2Ray/Trojan协议原理到科学上网避坑：翻墙机场科普深度好文',
    'tiktok-not-working.md': '国内怎么看TikTok？2026最新TikTok无网、无SIM卡与地区限制解决方法',
    'v2rayn-v2-tutorial.md': 'v2rayN配置使用教程：2026最新 Windows 翻墙客户端 v2rayN 下载与设置指南',
    'why-airports-cheap-1000g-vs-expensive-100g.md': '10元1000G便宜机场 vs 50元100G专线机场怎么选？揭秘翻墙机场价格陷阱'
};

console.log('Starting title updates...');

Object.keys(titleMap).forEach(file => {
    const filePath = path.join(postsDir, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${file}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse front matter
    const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
    if (!match) {
        console.warn(`No front matter found in ${file}`);
        return;
    }
    
    const fm = match[1];
    const newTitle = titleMap[file];
    
    // Check if title line exists
    if (!fm.match(/^title:\s*(.+)$/m)) {
        console.warn(`No title field in front matter for ${file}`);
        return;
    }
    
    // Replace the title in front matter
    const updatedFm = fm.replace(/^title:\s*(.+)$/m, `title: ${newTitle}`);
    const updatedContent = content.replace(fm, updatedFm);
    
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Updated: ${file} -> "${newTitle}"`);
});

console.log('All updates complete.');
