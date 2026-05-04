const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'source', '_posts');

// 1. Build a map of slug -> permalink
const slugToPermalink = {};

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const slug = file.replace('.md', '');
    
    // Extract date from frontmatter
    const dateMatch = content.match(/date:\s*(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
        const year = dateMatch[1];
        const month = dateMatch[2];
        const day = dateMatch[3];
        slugToPermalink[slug] = `/${year}/${month}/${day}/${slug}/`;
    } else {
        slugToPermalink[slug] = `/${slug}/`;
    }
}

// 2. Replace all /posts/slug/ occurrences in all files
let changedFilesCount = 0;

for (const file of files) {
    const filePath = path.join(postsDir, file);
    let originalContent = fs.readFileSync(filePath, 'utf-8');
    let content = originalContent;

    // We look for /posts/slug/ OR /posts/slug
    // using regex
    content = content.replace(/\/posts\/([a-zA-Z0-9-]+)\/?/g, (match, slug) => {
        if (slugToPermalink[slug]) {
            return slugToPermalink[slug];
        }
        return match; // If not found, leave as is
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated links in: ${file}`);
        changedFilesCount++;
    }
}

console.log(`Finished processing. Updated ${changedFilesCount} files.`);
