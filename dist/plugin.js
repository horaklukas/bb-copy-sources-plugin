"use strict";
const fs = require("fs");
const path = require("path");
const config_1 = require("./config");
const logger_1 = require("./logger");
let projectSrcDir, copyDestinationPath;
function readCopyFile(copyFilePath) {
    if (!fs.existsSync(copyFilePath)) {
        logger_1.log(`.copy file not found at path ${copyFilePath}, no sources copied.`);
        return;
    }
    return fs.readFileSync(copyFilePath).toString();
}
function init(project) {
    let config = project.pluginsConfig && project.pluginsConfig[config_1.pluginName];
    if (!config) {
        return 1; // plugin not involved
    }
    projectSrcDir = path.resolve(project.dir, 'src');
    if (!config.copyFile) {
        logger_1.log('plugin configuration requires "copyFile" field to be specified.');
        return 1;
    }
    let destination = readCopyFile(config.copyFile);
    if (!destination) {
        return 1;
    }
    copyDestinationPath = path.resolve(project.dir, destination);
    if (!fs.existsSync(copyDestinationPath) || !fs.lstatSync(copyDestinationPath).isDirectory()) {
        logger_1.log(`destination ${destination} (resolved to ${copyDestinationPath}) does not exist or is not a directory`);
        copyDestinationPath = undefined;
        return 1;
    }
    return 0;
}
exports.init = init;
function getDirs() {
    return {
        src: projectSrcDir,
        dest: copyDestinationPath
    };
}
exports.getDirs = getDirs;
//# sourceMappingURL=plugin.js.map