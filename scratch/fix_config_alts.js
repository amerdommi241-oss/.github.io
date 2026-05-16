const fs = require('fs');

let content = fs.readFileSync('_config.butterfly.yml', 'utf-8');
content = content.replace(/<img\s+(src="[^"]+")(?![^>]*alt=)([^>]*)>/gi, '<img $1 alt="广告图标" $2>');
fs.writeFileSync('_config.butterfly.yml', content, 'utf-8');
console.log('Updated _config.butterfly.yml with alt tags.');
