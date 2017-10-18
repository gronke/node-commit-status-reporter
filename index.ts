/// <reference types="node" />

export interface StatusOptions {
  status: Statuses;
  context: string;
  description?: string;
  target_url?: string;
}

interface GitHubApiRepo {
  createStatus(
    opts: StatusOptions,
    callback: (err: Error, res: {}) => void
  ): void;
}

interface GitHubApiInterface {
  authenticate(options: {}): void;
  repos: GitHubApiRepo;
}

const GitHubApi = require('github');

export class GitHub {

  private token_: string = '';
  public github: GitHubApiInterface;

  constructor(token: string) {
    this.github = new GitHubApi({});
    if (typeof token === 'undefined') {
      console.log('GitHub Statuses reporting disabled: no API token available');
    } else {
      this.token = token;
    }
  }

  set token(value: string) {
    this.token_ = value;
    this.authenticate(value);
  }

  get token(): string {
    return this.token_;
  }

  commit(hash: string): Commit {
    return new Commit(hash, this);
  }

  reportCommitStatus(commit: Commit, opts: StatusOptions): Promise<{}> {

    if (this.token === '') {
      return Promise.resolve({});
    }

    return new Promise((resolve, reject) => {
      this.github.repos.createStatus(opts, (err, res) => {
        if (err) {
          console.log(res);
          console.error(err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  private authenticate(token: string) {
    this.github.authenticate({
      type: 'oauth',
      token: this.token
    })
  }

}

export class Commit {

  statuses: { [key: string]: CommitStatus } = {};

  constructor(public hash: string, public github: GitHub) {}  
  
  getStatus(context: string): CommitStatus {
    return new CommitStatus(context, this, );
  }

  updateStatus(opts: StatusOptions): Promise<{}> {
    return this.github.reportCommitStatus(this, opts);
  }

}

export enum Statuses {
  pending,
  success,
  failure,
  error
}

export class CommitStatus {
  constructor(
    public context: string,
    private commit: Commit
  ) {}

  report(status: Statuses, description?: string, targetUrl?: string): Promise<{}> {
    const opts: StatusOptions = {
      context: this.context,
      status: status
    };
    if (description) {
      opts.description = description;
    }
    if (targetUrl) {
      opts.target_url = targetUrl
    }

    return this.commit.updateStatus(opts);

  }
}