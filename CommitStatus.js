"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Statuses_1 = require("./Statuses");
class CommitStatus {
    constructor(context, commit) {
        this.context = context;
        this.commit = commit;
    }
    report(status, description, targetUrl) {
        const opts = {
            context: this.context,
            state: Statuses_1.Statuses[status],
        };
        if (description) {
            opts.description = description;
        }
        if (targetUrl) {
            opts.target_url = targetUrl;
        }
        return this.commit.updateStatus(opts);
    }
}
exports.default = CommitStatus;
