const fs = require("fs");
const path = require("path");
const https = require("https");

const postsDir = path.join(__dirname, "source", "_posts");
const imgDir = path.join(__dirname, "source", "img", "docs");
const baseUrl = "https://i.theojs.cn/docs/";

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

function download(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) return resolve();
        https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Status: ${res.statusCode} for ${url}`);
                return resolve(); 
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => { file.close(); resolve(); });
        }).on("error", (err) => {
            console.error(`Error downloading ${url}`, err);
            resolve();
        });
    });
}

async function run() {
    const missingImages = new Set();
    const files = fs.readdirSync(postsDir);

    for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const content = fs.readFileSync(path.join(postsDir, file), "utf-8");
        const matches = content.match(/\/img\/docs\/[a-zA-Z0-9.\-_]+\.webp/g);
        if (matches) {
            for (const m of matches) {
                const filename = path.basename(m);
                const localPath = path.join(imgDir, filename);
                if (!fs.existsSync(localPath)) {
                    missingImages.add(filename);
                }
            }
        }
    }

    console.log(`Found ${missingImages.size} missing images.`);

    for (const filename of missingImages) {
        const url = baseUrl + filename;
        const dest = path.join(imgDir, filename);
        console.log(`Downloading ${filename} from ${url}...`);
        await download(url, dest);
    }

    console.log("Done!");
}

run();
