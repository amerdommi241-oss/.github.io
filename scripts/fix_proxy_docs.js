const fs = require('fs');
const path = require('path');

const PROXY_DIR = path.join(__dirname, '../source/docs/proxy');

const NEW_MENUS_ITEMS = `<div class="menus_items"><div class="menus_item"><a class="site-page" href="/"><i class="fa-fw fas fa-home"></i><span> 首页</span></a></div><div class="menus_item"><a class="site-page" href="/2026/02/20/airport-recommendations/"><i class="fa-fw fas fa-plane"></i><span> 机场推荐导航</span></a></div><div class="menus_item"><a class="site-page" href="/software/"><i class="fa-fw fas fa-download"></i><span> 软件下载教程</span></a></div><div class="menus_item"><a class="site-page" href="/2026/03/01/how-to-choose-airport/"><i class="fa-fw fas fa-book"></i><span> 科学上网知识库</span></a></div><div class="menus_item"><a class="site-page" href="/categories/AI%E5%B7%A5%E5%85%B7/"><i class="fa-fw fas fa-robot"></i><span> AI工具</span></a></div><div class="menus_item"><a class="site-page" href="/2026/03/01/streaming-accounts-guide/"><i class="fa-fw fas fa-play-circle"></i><span> 流媒体专区</span></a></div></div>`;

function processFile(filepath) {
    console.log(`Processing ${filepath}...`);
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Sync Navigation Menu
    // Sidebar
    content = content.replace(
        /<div class="menus_items">[\s\S]*?<\/div><\/div><\/div><div class="page" id="body-wrap">/,
        NEW_MENUS_ITEMS + '</div></div></div><div class="page" id="body-wrap">'
    );
    
    // Top Menu
    content = content.replace(
        /<div id="menus"><div class="menus_items">[\s\S]*?<\/div><div id="toggle-menu">/,
        `<div id="menus">${NEW_MENUS_ITEMS}<div id="toggle-menu">`
    );

    // 2. Fix inner broken links for software itself
    const softwarePattern = /<p>\[<img src="([^"]+)">(.*?)<\/p>\s*<p>(.*?)<\/p>\s*<p>\]\(&#x2F;serve&#x2F;antiwall&#x2F;.*?\)<\/p>/g;
    content = content.replace(softwarePattern, (match, p1, p2, p3) => {
        return `<div style="padding:15px; background:#f8f9fa; border-radius:8px; display:flex; align-items:center; margin-bottom: 20px;"><img src="${p1}" style="width:40px; height:40px; margin-right:15px; border-radius:8px;"><div><strong>${p2}</strong><br><span style="font-size:13px; color:#666;">${p3}</span></div></div>`;
    });

    // 3. Fix broken links for Airport Summary
    const airportPattern = /<p>\[优质机场汇总<\/p>\s*<p>(.*?)<\/p>\s*<p>立即购买<\/p>\s*<p>\]\(&#x2F;serve&#x2F;airport&#x2F;summary\)<\/p>/g;
    content = content.replace(airportPattern, (match, p1) => {
        return `<div style="padding:15px; background:#e8f4fd; border-left:4px solid #2196f3; border-radius:4px; margin-bottom: 20px;"><strong>🚀 优质机场汇总</strong><br><span style="font-size:14px; color:#555;">${p1}</span><br><br><a href="/2026/02/20/airport-recommendations/" style="display:inline-block; padding:8px 15px; background:#2196f3; color:#fff; border-radius:4px; text-decoration:none;">立即购买</a></div>`;
    });

    // 4. Clean any residual stray broken format blocks
    content = content.replace(/<p>\]\(&#x2F;serve.*?\)<\/p>/g, '');

    fs.writeFileSync(filepath, content, 'utf8');
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('index.html')) {
            processFile(fullPath);
        }
    }
}

traverseDir(PROXY_DIR);
console.log('Done.');
