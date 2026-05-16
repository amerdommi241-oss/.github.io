const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getFiles(path.join(__dirname, 'public'));
const titles = {};
const descriptions = {};
const shortDescriptions = [];
const missingAlts = [];

for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check Title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
        const title = titleMatch[1];
        if (!titles[title]) titles[title] = [];
        titles[title].push(file);
    }
    
    // Check Description
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
    if (descMatch) {
        const desc = descMatch[1];
        if (!descriptions[desc]) descriptions[desc] = [];
        descriptions[desc].push(file);
        
        if (desc.length < 100) {
            shortDescriptions.push({ file, length: desc.length });
        }
    }

    // Check img alt tags
    const imgMatches = content.matchAll(/<img\s+[^>]*>/gi);
    for (const match of imgMatches) {
        const imgTag = match[0];
        if (!imgTag.toLowerCase().includes('alt="') && !imgTag.toLowerCase().includes("alt='")) {
            missingAlts.push({ file, imgTag });
        }
    }
}

let duplicateTitles = 0;
for (const [title, files] of Object.entries(titles)) {
    if (files.length > 1) {
        duplicateTitles++;
        console.log(`Duplicate Title (${files.length}): ${title}`);
        console.log(`  Sample: ${files[0]}`);
    }
}

let duplicateDesc = 0;
for (const [desc, files] of Object.entries(descriptions)) {
    if (files.length > 1) {
        duplicateDesc++;
        console.log(`Duplicate Desc (${files.length}): ${desc.substring(0, 50)}...`);
        console.log(`  Sample: ${files[0]}`);
    }
}

console.log(`\nDuplicate Titles: ${duplicateTitles}`);
console.log(`Duplicate Descriptions: ${duplicateDesc}`);
console.log(`Short Descriptions: ${shortDescriptions.length}`);
console.log(`Missing alt attributes: ${missingAlts.length}`);
