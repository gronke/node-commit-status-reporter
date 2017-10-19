import * as Github from "github";
import { Statuses } from "./Statuses";

import * as GitHubApi from "github";
import Commit from "./Commit";

export default class Repository {

  public github = new GitHubApi({});
  private githubAccessToken = "";

  constructor(
    public owner: string,
    public repo: string,
    token: string,
  ) {
    if (typeof token === "undefined") {
      console.log("GitHub Statuses reporting disabled: no API token available");
    } else {
      this.token = token;
    }
  }

  public set token(value: string) {
    this.githubAccessToken = value;
    this.authenticate(value);
  }

  public get token(): string {
    return this.githubAccessToken;
  }

  public commit(hash: string): Commit {
    return new Commit(hash, this);
  }

  public reportCommitStatus(commit: Commit, opts: Github.ReposCreateStatusParams): Promise<{}> {

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
        } else {
          resolve(res);
        }
      });
    });
  }

  private authenticate(token: string) {
    this.github.authenticate({
      token: this.token,
      type: "oauth",
    });
  }

}
