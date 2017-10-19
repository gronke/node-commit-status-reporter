System.register("Statuses", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Statuses;
    return {
        setters: [],
        execute: function () {
            (function (Statuses) {
                Statuses[Statuses["pending"] = 0] = "pending";
                Statuses[Statuses["success"] = 1] = "success";
                Statuses[Statuses["failure"] = 2] = "failure";
                Statuses[Statuses["error"] = 3] = "error";
            })(Statuses || (Statuses = {}));
            exports_1("Statuses", Statuses);
            ;
        }
    };
});
System.register("CommitStatus", ["Statuses"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Statuses_1, CommitStatus;
    return {
        setters: [
            function (Statuses_1_1) {
                Statuses_1 = Statuses_1_1;
            }
        ],
        execute: function () {
            CommitStatus = class CommitStatus {
                constructor(context, commit) {
                    this.context = context;
                    this.commit = commit;
                }
                report(status, description, targetUrl) {
                    const opts = {
                        context: this.context,
                        state: Statuses_1.Statuses[status]
                    };
                    if (description) {
                        opts.description = description;
                    }
                    if (targetUrl) {
                        opts.target_url = targetUrl;
                    }
                    return this.commit.updateStatus(opts);
                }
            };
            exports_2("default", CommitStatus);
        }
    };
});
System.register("Repository", ["github", "Commit"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var GitHubApi, Commit_1, Repository;
    return {
        setters: [
            function (GitHubApi_1) {
                GitHubApi = GitHubApi_1;
            },
            function (Commit_1_1) {
                Commit_1 = Commit_1_1;
            }
        ],
        execute: function () {
            Repository = class Repository {
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
                    return new Commit_1.default(hash, this);
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
            };
            exports_3("default", Repository);
        }
    };
});
System.register("Commit", ["CommitStatus"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var CommitStatus_1, Commit;
    return {
        setters: [
            function (CommitStatus_1_1) {
                CommitStatus_1 = CommitStatus_1_1;
            }
        ],
        execute: function () {
            Commit = class Commit {
                constructor(hash, repo) {
                    this.hash = hash;
                    this.repo = repo;
                    this.statuses = {};
                }
                getStatus(context) {
                    return new CommitStatus_1.default(context, this);
                }
                updateStatus(opts) {
                    opts = Object.assign(opts, {
                        sha: this.hash
                    });
                    return this.repo.reportCommitStatus(this, opts);
                }
            };
            exports_4("default", Commit);
        }
    };
});
System.register("index", ["Commit", "CommitStatus", "Repository", "Statuses"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Commit_2, CommitStatus_2, Repository_1, Statuses_2;
    return {
        setters: [
            function (Commit_2_1) {
                Commit_2 = Commit_2_1;
            },
            function (CommitStatus_2_1) {
                CommitStatus_2 = CommitStatus_2_1;
            },
            function (Repository_1_1) {
                Repository_1 = Repository_1_1;
            },
            function (Statuses_2_1) {
                Statuses_2 = Statuses_2_1;
            }
        ],
        execute: function () {
            exports_5("Commit", Commit_2.default);
            exports_5("CommitStatus", CommitStatus_2.default);
            exports_5("Repository", Repository_1.default);
            exports_5("Statuses", Statuses_2.Statuses);
        }
    };
});
