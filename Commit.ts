import * as Github from "./node_modules/github/lib/index";

import CommitStatus from "./CommitStatus";
import Repository from "./Repository";

export default class Commit {

  public statuses: { [key: string]: CommitStatus } = {};

  constructor(public hash: string, public repo: Repository) {}

  public getStatus(context: string): CommitStatus {
    if (typeof this.statuses[context] === "undefined") {
      this.statuses[context] = new CommitStatus(context, this);
    }
    return this.statuses[context];
  }

  public updateStatus(opts: Github.ReposCreateStatusParams): Promise<{}> {
    opts = Object.assign(opts, {
      sha: this.hash,
    });
    return this.repo.reportCommitStatus(this, opts);
  }

}
