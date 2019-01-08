const fs = require('fs');
const path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
 * 
 * 
 * @param {string} dirname - Path relative to the current directory
 * @api public
 */

function dispatchImporter(dirname) {
    /**
     * 
     * @param {string} from - Directory to load modules from
     */
    function importer(from) {
        const imported = {};
        const joinPath = function() {
            return '.' + path.sep + path.join.apply(path, arguments);
        }
        const fsPath = joinPath(path.relative(process.cwd(), dirname), from);
        fs.readdirSync(fsPath).forEach(function(name) {
            const info = fs.statSync(path.join(fsPath, name));
            if (info.isDirectory()) {
                // Import modules from directory (recursively)
                imported[name] = importer(path.join(from, name));
            } else {
                // Only import files that we can require
                const ext = path.extname(name);
                const base = path.basename(name, ext);
                if (require.extensions[ext]) {
                    imported[base] = require(path.join(dirname, from, name));
                }
            }
        });
        return imported;
    }
    return importer;
}

module.exports = dispatchImporter;