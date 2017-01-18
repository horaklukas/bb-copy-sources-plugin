import * as bb from 'bobril-build';
import * as fs from 'fs';
import * as path from 'path';
import {pluginName} from './config'
import {log} from './logger'

let projectSrcDir,
	copyDestinationPath;

let first = true;

interface IPluginConfiguration {
	destination: string
}

function init(project: bb.IProject): number {
	let config: IPluginConfiguration = project.pluginsConfig && project.pluginsConfig[pluginName];

	if (!config) {
		return 1; // plugin not involved
	}

	projectSrcDir = path.resolve(project.dir, 'src');

	if (!config.destination) {
		log('plugin configuration requires "destination" field to be specified.');
		return 1;
	}

	copyDestinationPath = path.resolve(project.dir, config.destination);

	if(!fs.existsSync(copyDestinationPath) || !fs.lstatSync(copyDestinationPath).isDirectory()) {
		copyDestinationPath = null;
		log(`destination ${config.destination} (resolved to ${copyDestinationPath}) does not exist or is not a directory`);
		return 1;
	}

	return 0;
}

export function isEnabled() {
	if (first) {
		init(bb.getProject());
		first = false;
	}

	return copyDestinationPath !== undefined;
}

export function getDirs(): {src: string, dest: string} {
	return {
		src: projectSrcDir,
		dest: copyDestinationPath
	}
}