"use strict";
/// <reference types="node" />
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubApi = require('github');
class GitHub {
    constructor(token) {
        this.token_ = '';
        this.github = new GitHubApi({});
        if (typeof token === 'undefined') {
            console.log('No API token available. Reporting skipped.');
        }
        else {
            this.token = token;
        }
    }
    set token(value) {
        this.token_ = value;
        this.authenticate(value);
    }
    get token() {
        return this.token_;
    }
    commit(hash) {
        return new Commit(hash, this);
    }
    reportCommitStatus(commit, opts) {
        if (this.token === '') {
            return Promise.resolve({});
        }
        return new Promise((resolve, reject) => {
            this.github.repos.createStatus(opts, (err, res) => {
                if (err) {
                    console.log(res);
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    authenticate(token) {
        this.github.authenticate({
            type: 'oauth',
            token: this.token
        });
    }
}
exports.GitHub = GitHub;
class Commit {
    constructor(hash, github) {
        this.hash = hash;
        this.github = github;
        this.statuses = {};
    }
    getStatus(context) {
        return new CommitStatus(context, this);
    }
    updateStatus(opts) {
        return this.github.reportCommitStatus(this, opts);
    }
}
exports.Commit = Commit;
var Statuses;
(function (Statuses) {
    Statuses[Statuses["pending"] = 0] = "pending";
    Statuses[Statuses["success"] = 1] = "success";
    Statuses[Statuses["failure"] = 2] = "failure";
    Statuses[Statuses["error"] = 3] = "error";
})(Statuses = exports.Statuses || (exports.Statuses = {}));
class CommitStatus {
    constructor(context, commit) {
        this.context = context;
        this.commit = commit;
    }
    report(status, description, targetUrl) {
        const opts = {
            context: this.context,
            status: status
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
exports.CommitStatus = CommitStatus;
