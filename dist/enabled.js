"use strict";
const bb = require('bobril-build');
const fs = require('fs');
const path = require('path');
const config_1 = require('./config');
const logger_1 = require('./logger');
let projectSrcDir, copyDestinationPath;
let first = true;
function init(project) {
    let config = project.pluginsConfig && project.pluginsConfig[config_1.pluginName];
    if (!config) {
        return 1; // plugin not involved
    }
    projectSrcDir = path.resolve(project.dir, 'src');
    if (!config.destination) {
        logger_1.log('plugin configuration requires "destination" field to be specified.');
        return 1;
    }
    copyDestinationPath = path.resolve(project.dir, config.destination);
    if (!fs.existsSync(copyDestinationPath) || !fs.lstatSync(copyDestinationPath).isDirectory()) {
        copyDestinationPath = null;
        logger_1.log(`destination ${config.destination} (resolved to ${copyDestinationPath}) does not exist or is not a directory`);
        return 1;
    }
    return 0;
}
function isEnabled() {
    if (first) {
        init(bb.getProject());
        first = false;
    }
    return copyDestinationPath !== undefined;
}
exports.isEnabled = isEnabled;
function getDirs() {
    return {
        src: projectSrcDir,
        dest: copyDestinationPath
    };
}
exports.getDirs = getDirs;
//# sourceMappingURL=enabled.js.map