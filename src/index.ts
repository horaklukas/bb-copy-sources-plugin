import * as bb from 'bobril-build';
import * as path from 'path';
import {ncp} from 'ncp';
import {log} from './logger';
import {isEnabled, getDirs} from './enabled';

//export function afterStartCompileProcess(project) {
//}

export function afterInteractiveCompile(compileResults: { errors: number, warnings: number, hasTests: boolean }) {
    if (!compileResults.errors && isEnabled()) {
        const dirs = getDirs();
        const start = Date.now();

        log(`Copying all from ${dirs.src} to ${dirs.dest}`);
        ncp(dirs.src, path.resolve(dirs.dest, 'src'), function(err) {
            if (err) {
                return log(`Copying failed: ${err.toString()}`);
            }
            log(`Copying done in ${Date.now() - start}ms`)
        });
    }
}