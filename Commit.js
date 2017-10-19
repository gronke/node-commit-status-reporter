"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommitStatus_1 = require("./CommitStatus");
class Commit {
    constructor(hash, repo) {
        this.hash = hash;
        this.repo = repo;
        this.statuses = {};
    }
    getStatus(context) {
        if (typeof this.statuses[context] === "undefined") {
            this.statuses[context] = new CommitStatus_1.default(context, this);
        }
        return this.statuses[context];
    }
    updateStatus(opts) {
        opts = Object.assign(opts, {
            sha: this.hash,
        });
        return this.repo.reportCommitStatus(this, opts);
    }
}
exports.default = Commit;
