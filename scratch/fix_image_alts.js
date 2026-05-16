const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');

function getMarkdownFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getMarkdownFiles(filePath, fileList);
        } else if (filePath.endsWith('.md')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const mdFiles = getMarkdownFiles(postsDir);
let totalFixed = 0;

for (const file of mdFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    // Get title from frontmatter
    let title = "image";
    const titleMatch = content.match(/^title:\s*(.*)$/m);
    if (titleMatch) {
        title = titleMatch[1].replace(/["']/g, '').trim();
    }

    // 1. Fix Markdown images: ![](/path/to/img.png)
    // Be careful with ![something](/path), we only want to fix ![]
    const mdImgRegex = /!\[\]\(([^)]+)\)/g;
    content = content.replace(mdImgRegex, (match, url) => {
        modified = true;
        totalFixed++;
        // Try to use filename as alt if possible
        let altText = title;
        try {
            const fileName = path.basename(url, path.extname(url));
            if (fileName && !fileName.startsWith('http') && fileName.length > 2) {
                altText = fileName;
            }
        } catch (e) {}
        return `![${altText}](${url})`;
    });

    // 2. Fix HTML images: <img src="...">
    const htmlImgRegex = /<img\s+([^>]*?)>/gi;
    content = content.replace(htmlImgRegex, (match, attrs) => {
        if (!attrs.toLowerCase().includes('alt="') && !attrs.toLowerCase().includes("alt='")) {
            modified = true;
            totalFixed++;
            return `<img ${attrs} alt="${title}">`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${path.basename(file)}`);
    }
}

console.log(`\nFixed ${totalFixed} image tags across all markdown files.`);
