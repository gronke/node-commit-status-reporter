"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubApi = require('github');
class GitHubRepository {
    constructor(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.token_ = '';
        this.github = new GitHubApi({});
        if (typeof token === 'undefined') {
            console.log('GitHub Statuses reporting disabled: no API token available');
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
        opts = Object.assign(opts, {
            token: this.token,
            owner: this.owner,
            repo: this.repo
        });
        return new Promise((resolve, reject) => {
            this.github.repos.createStatus(opts, (err, res) => {
                if (err) {
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
exports.GitHubRepository = GitHubRepository;
class Commit {
    constructor(hash, repo) {
        this.hash = hash;
        this.repo = repo;
        this.statuses = {};
    }
    getStatus(context) {
        return new CommitStatus(context, this);
    }
    updateStatus(opts) {
        opts = Object.assign(opts, {
            sha: this.hash
        });
        return this.repo.reportCommitStatus(this, opts);
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
            state: Statuses[status]
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
