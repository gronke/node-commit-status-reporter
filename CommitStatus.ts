import * as Github from "./node_modules/github/lib/index";

import Commit from "./Commit";
import { Statuses } from "./Statuses";

export default class CommitStatus {
  constructor(
    public context: string,
    private commit: Commit,
  ) {}

  public report(status: Statuses, description?: string, targetUrl?: string): Promise<{}> {

    const opts = ({
      context: this.context,
      state: (Statuses[status] as string),
    } as Github.ReposCreateStatusParams);

    if (description) {
      opts.description = description;
    }

    if (targetUrl) {
      opts.target_url = targetUrl;
    }

    return this.commit.updateStatus(opts);

  }
}
