const fs = require('fs');
const path = require('path');
const d = {
    'airport-recommendations.md':['VPN推荐','便宜机场','稳定机场'],
    'airport-routes-selection.md':['专线机场','IPLC/IEPL','中转机场','直连节点'],
    'airport-routes-difference.md':['节点测速','机场评测','线路解析'],
    'determine-line-type.md':['线路鉴别','BGP跨境','原生IP'],
    'airport-vs-vpn.md':['传统VPN','机场对比','新手避坑'],
    'how-to-choose-airport.md':['防跑路','选购指南','月付为主'],
    'openclaw-tutorial.md':['OpenClaw教程','开源客户端','抓取节点'],
    'mobile-vpn-guide.md':['手机翻墙','苹果iOS梯子','安卓梯子'],
    'gfw-websites-guide.md':['GFW科普','墙外资源','必备网站'],
    'airport-speed-analysis.md':['单线程测试','多线程并发'],
    'telegram-guide.md':['Telegram','电报新手','纸飞机教程'],
    'telegram-search-guide.md':['电报搜索','极搜','电报群组'],
    'sms-verification-platforms.md':['接码平台','虚拟号','注册海外服务'],
    'gemini-in-china.md':['Gemini','Google AI','国内体验'],
    'grok-4-tutorial.md':['Grok 4','X平台AI','推特机器人'],
    'chatgpt-mirrors-guide.md':['ChatGPT','国内直连镜像','免费AI'],
    'claude-guide.md':['Claude 3','账号解封','防封号'],
    'midjourney-guide.md':['Midjourney','AI绘画','作图提示词'],
    'netflix-guide.md':['Netflix','奈飞解锁','原生节点'],
    'spotify-guide.md':['Spotify','音乐会员','跨区充值'],
    'netflix-secret-classification.md':['奈飞隐藏代码','电影分类','美剧推荐'],
    'streaming-accounts-guide.md':['流媒体合租','奈飞发车','银河录像局'],
    'software.md':['Clash Verge','Shadowrocket','软件下载']
};
const dir = path.join(__dirname, 'source', '_posts');
for (const f of fs.readdirSync(dir)){
    if(!f.endsWith('.md')) continue;
    const p = path.join(dir, f);
    let c = fs.readFileSync(p,'utf8');
    let lines = c.split('\n');
    let tagsIndex = lines.findIndex(l => l.startsWith('tags:'));
    if (tagsIndex !== -1) {
        try {
            let match = lines[tagsIndex].match(/\[(.*?)\]/);
            let currentTags = match ? match[1].split(',').map(s=>s.trim()).filter(s=>s!=='' && s!==']') : [];
            const toAdd = d[f] || [];
            for(const n of toAdd) {
                if(!currentTags.includes(n)) currentTags.push(n);
            }
            if (currentTags.length > 0) {
                lines[tagsIndex] = 'tags: [' + currentTags.join(', ') + ']';
                fs.writeFileSync(p, lines.join('\n'), 'utf8');
                console.log('Enriched: ' + f + ' -> ' + currentTags.length + ' tags');
            }
        } catch(e) {
            console.log('Error on file ' + f + ': ' + e.message);
        }
    }
}
console.log('Done enriching tags!');
