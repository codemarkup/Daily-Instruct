const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content
                .replace(/(['"`])\/admin/g, '$1/hq')
                .replace(/(['"`])\/api\/admin/g, '$1/api/hq');
            
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInDir(path.join(__dirname, 'app'));
replaceInDir(path.join(__dirname, 'components'));
replaceInDir(path.join(__dirname, 'lib'));
replaceInDir(path.join(__dirname, 'services'));

// Rename directories
fs.renameSync(path.join(__dirname, 'app', 'admin'), path.join(__dirname, 'app', 'hq'));
if (fs.existsSync(path.join(__dirname, 'app', 'api', 'admin'))) {
    fs.renameSync(path.join(__dirname, 'app', 'api', 'admin'), path.join(__dirname, 'app', 'api', 'hq'));
}

console.log("Renamed directories to /hq");
