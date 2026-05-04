const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');

function sanitize(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const parts = content.split('---');
    if (parts.length < 3) return;

    let frontMatter = parts[1];
    let body = parts.slice(2).join('---').trim();

    // Extract fields
    const titleMatch = frontMatter.match(/title:\s*"?(.*?)"?\n/);
    const dateMatch = frontMatter.match(/date:\s*([^\n]+)/);
    const updatedMatch = frontMatter.match(/updated:\s*([^\n]+)/);
    const stickyMatch = frontMatter.match(/sticky:\s*([^\n]+)/);
    const keywordsMatch = frontMatter.match(/keywords:\s*([^\n]+)/);
    const descriptionMatch = frontMatter.match(/description:\s*([^\n]+)/);
    
    // Extract tags - handle both array and list formats
    let tags = [];
    const tagsInlineMatch = frontMatter.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsInlineMatch) {
        tags = tagsInlineMatch[1].split(',').map(t => t.trim());
    } else {
        const tagsBlockMatch = frontMatter.match(/tags:[\s\S]*?(?=\n[a-z]|\n---)/);
        if (tagsBlockMatch) {
            const tagItems = tagsBlockMatch[0].matchAll(/-\s*([^\n]+)/g);
            for (const t of tagItems) tags.push(t[1].trim());
        }
    }
    
    // Extract categories - handle both formats
    let categories = [];
    const catInlineMatch = frontMatter.match(/categories:\s*\[([^\]]+)\]/);
    if (catInlineMatch) {
        categories = catInlineMatch[1].split(',').map(c => c.trim());
    } else {
        const catBlockMatch = frontMatter.match(/categories:[\s\S]+?\n(?=[a-z]+:|---)/);
        if (catBlockMatch) {
            const cats = catBlockMatch[0].matchAll(/-\s*([^\n]+)/g);
            for (const c of cats) categories.push(c[1].trim());
        }
    }

    // Standard mappings (fallback if extraction is messy)
    const mappings = {
        '机场推荐': ['airport-recommendations.md'],
        '科学上网知识库': [
            'airport-routes-selection.md', 'airport-routes-difference.md', 
            'determine-line-type.md', 'airport-vs-vpn.md', 
            'how-to-choose-airport.md', 'openclaw-tutorial.md', 
            'mobile-vpn-guide.md', 'gfw-websites-guide.md', 'airport-speed-analysis.md',
            'telegram-guide.md', 'telegram-search-guide.md', 'sms-verification-platforms.md'
        ],
        'AI工具': [
            'gemini-in-china.md', 'grok-4-tutorial.md', 
            'chatgpt-mirrors-guide.md', 'claude-guide.md', 'midjourney-guide.md'
        ],
        '流媒体专区': [
            'netflix-guide.md', 'spotify-guide.md', 
            'netflix-secret-classification.md', 'streaming-accounts-guide.md'
        ]
    };

    const fileName = path.basename(filePath);
    let targetCat = categories[0] || '默认分类';
    for (const [cat, files] of Object.entries(mappings)) {
        if (files.includes(fileName)) {
            targetCat = cat;
            break;
        }
    }

    // Combine tags, category, and standard keywords for better SEO and rich Tag Cloud
    const globalTags = ['科学上网', '机场推荐', '翻墙', '科学上网教程'];
    let allTags = new Set([...tags, targetCat, ...globalTags]);
    tags = Array.from(allTags);

    // Reconstruct Front Matter - preserving all important fields
    const fmLines = [
        '---',
        `title: ${(titleMatch ? titleMatch[1] : fileName.replace('.md', '')).replace(/"/g, '')}`,
        `date: ${dateMatch ? dateMatch[1].trim() : '2026-03-01 12:00:00'}`
    ];
    
    // Preserve optional fields
    if (updatedMatch) fmLines.push(`updated: ${updatedMatch[1].trim()}`);
    
    // Tags
    if (tags.length > 0) {
        fmLines.push(`tags: [${tags.join(', ')}]`);
    }
    
    // Categories  
    fmLines.push(`categories: [${targetCat}]`);
    
    // Preserve keywords & description
    if (keywordsMatch) fmLines.push(`keywords: ${keywordsMatch[1].trim()}`);
    if (descriptionMatch) fmLines.push(`description: ${descriptionMatch[1].trim()}`);
    
    // Preserve sticky
    if (stickyMatch) fmLines.push(`sticky: ${stickyMatch[1].trim()}`);
    
    fmLines.push('---');

    const newContent = fmLines.join('\n') + '\n\n' + body;
    
    // Only write if content actually changed
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Sanitized: ${fileName}`);
    }
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
files.forEach(f => sanitize(path.join(postsDir, f)));
