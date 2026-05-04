const fs = require("fs");
const path = require("path");
const https = require("https");

const rootDirs = [
    path.join(__dirname, "source", "docs", "proxy"),
    path.join(__dirname, "source", "_posts")
];
const imgDir = path.join(__dirname, "source", "img", "docs");
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

function download(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) return resolve();
        https.get(url, { headers: { "User-Agent": "curl/7.81.0" } }, (res) => {
            if (res.statusCode !== 200) {
                console.error("Status: " + res.statusCode + " for " + url);
                return resolve(); // Skip
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => { file.close(); resolve(); });
        }).on("error", (err) => {
            console.error("Error downloading " + url, err);
            resolve();
        });
    });
}

async function start() {
    const urls = new Set();
    const filesToModify = [];

    function scanDir(d) {
        if (!fs.existsSync(d)) return;
        const entries = fs.readdirSync(d, { withFileTypes: true });
        for (const entry of entries) {
            const p = path.join(d, entry.name);
            if (entry.isDirectory()) scanDir(p);
            else if (entry.isFile() && (p.endsWith(".html") || p.endsWith(".md"))) {
                let content = fs.readFileSync(p, "utf-8");
                const matches = content.match(/https:\/\/i\.theojs\.cn\/docs\/[^\s\"\'<>)]+/g);
                if (matches) {
                    matches.forEach(m => urls.add(m));
                    filesToModify.push(p);
                }
            }
        }
    }
    
    rootDirs.forEach(scanDir);
    console.log("Found " + urls.size + " unique images.");

    for (const url of urls) {
        const filename = path.basename(url);
        const dest = path.join(imgDir, filename);
        console.log("Downloading " + filename);
        await download(url, dest);
    }

    filesToModify.forEach(file => {
        let content = fs.readFileSync(file, "utf-8");
        content = content.replace(/https:\/\/i\.theojs\.cn\/docs\//g, "/img/docs/");
        fs.writeFileSync(file, content, "utf-8");
        console.log("Updated " + file);
    });
    console.log("Done!");
}
start();
