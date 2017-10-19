"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitHubApi = require("github");
const Commit_1 = require("./Commit");
class Repository {
    constructor(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.github = new GitHubApi({});
        this.githubAccessToken = "";
        if (typeof token === "undefined") {
            console.log("GitHub Statuses reporting disabled: no API token available");
        }
        else {
            this.token = token;
        }
    }
    set token(value) {
        this.githubAccessToken = value;
        this.authenticate(value);
    }
    get token() {
        return this.githubAccessToken;
    }
    commit(hash) {
        return new Commit_1.default(hash, this);
    }
    reportCommitStatus(commit, opts) {
        if (this.token === "") {
            return Promise.resolve({});
        }
        opts = Object.assign(opts, {
            owner: this.owner,
            repo: this.repo,
            token: this.token,
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
            token: this.token,
            type: "oauth",
        });
    }
}
exports.default = Repository;
