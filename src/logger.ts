import {pluginName} from './config';

export function log(message: string) {
	console.log(`${pluginName}: ${message}`);
}