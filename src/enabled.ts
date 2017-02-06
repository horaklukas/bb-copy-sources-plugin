import * as bb from 'bobril-build';
import * as plugin from './plugin';

let first = true;

export function isEnabled() {
	if (first) {
		plugin.init(bb.getProject());
		first = false;
	}

	return plugin.getDirs().dest !== undefined;
}