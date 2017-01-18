"use strict";
const path = require('path');
const ncp_1 = require('ncp');
const logger_1 = require('./logger');
const enabled_1 = require('./enabled');
//export function afterStartCompileProcess(project) {
//}
function afterInteractiveCompile(compileResults) {
    if (!compileResults.errors && enabled_1.isEnabled()) {
        const dirs = enabled_1.getDirs();
        const start = Date.now();
        logger_1.log(`Copying all from ${dirs.src} to ${dirs.dest}`);
        ncp_1.ncp(dirs.src, path.resolve(dirs.dest, 'src'), function (err) {
            if (err) {
                return logger_1.log(`Copying failed: ${err.toString()}`);
            }
            logger_1.log(`Copying done in ${Date.now() - start}ms`);
        });
    }
}
exports.afterInteractiveCompile = afterInteractiveCompile;
//# sourceMappingURL=index.js.map