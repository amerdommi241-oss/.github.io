const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log('--- Post Titles and Front Matter ---');
files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
    if (match) {
        const fm = match[1];
        const titleMatch = fm.match(/^title:\s*(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE';
        console.log(`${file}: ${title}`);
    } else {
        console.log(`${file}: NO FRONT MATTER`);
    }
});
