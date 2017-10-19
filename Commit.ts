import * as Github from "./node_modules/github/lib/index";

import CommitStatus from './CommitStatus';
import Repository from './Repository';

export default class Commit {

  statuses: { [key: string]: CommitStatus } = {};

  constructor(public hash: string, public repo: Repository) {}  
  
  getStatus(context: string): CommitStatus {
    return new CommitStatus(context, this, );
  }

  updateStatus(opts: Github.ReposCreateStatusParams): Promise<{}> {
    opts = Object.assign(opts, {
      sha: this.hash
    });
    return this.repo.reportCommitStatus(this, opts);
  }

}
