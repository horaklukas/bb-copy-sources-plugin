"use strict";
const bb = require("bobril-build");
const plugin = require("./plugin");
let first = true;
function isEnabled() {
    if (first) {
        plugin.init(bb.getProject());
        first = false;
    }
    return plugin.getDirs().dest !== undefined;
}
exports.isEnabled = isEnabled;
//# sourceMappingURL=enabled.js.map