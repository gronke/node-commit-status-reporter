import * as Github from "./node_modules/github/lib/index";
import { Statuses } from './Statuses';

import * as GitHubApi from 'github';
import Commit from './Commit';

export default class Repository {

  private token_ = '';
  public github = new GitHubApi({});

  constructor(
    public owner: string,
    public repo: string,
    token: string
  ) {
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

  reportCommitStatus(commit: Commit, opts: Github.ReposCreateStatusParams): Promise<{}> {

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
    });
  }

}