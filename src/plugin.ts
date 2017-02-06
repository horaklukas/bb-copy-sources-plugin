import * as bb from 'bobril-build';
import * as fs from 'fs';
import * as path from 'path';
import {pluginName} from './config'
import {log} from './logger'

let projectSrcDir,
	copyDestinationPath;

interface IPluginConfiguration {
	copyFile: string
}

function readCopyFile(copyFilePath) {
	if (!fs.existsSync(copyFilePath)) {
		log(`.copy file not found at path ${copyFilePath}, no sources copied.`);
		return;
	}

	return fs.readFileSync(copyFilePath).toString();
}

export function init(project: bb.IProject): number {
	let config: IPluginConfiguration = project.pluginsConfig && project.pluginsConfig[pluginName];

	if (!config) {
		return 1; // plugin not involved
	}

	projectSrcDir = path.resolve(project.dir, 'src');

	if (!config.copyFile) {
		log('plugin configuration requires "copyFile" field to be specified.');
		return 1;
	}

	let destination = readCopyFile(config.copyFile);

	if (!destination) {
		return 1;
	}

	copyDestinationPath = path.resolve(project.dir, destination);

	if(!fs.existsSync(copyDestinationPath) || !fs.lstatSync(copyDestinationPath).isDirectory()) {
		log(`destination ${destination} (resolved to ${copyDestinationPath}) does not exist or is not a directory`);
		copyDestinationPath = undefined;
		return 1;
	}

	return 0;
}

export function getDirs(): {src: string, dest: string} {
	return {
		src: projectSrcDir,
		dest: copyDestinationPath
	}
}