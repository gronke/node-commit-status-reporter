import * as Github from "./node_modules/github/lib/index";

import Commit from "./Commit";
import CommitStatus from "./CommitStatus";
import Repository from "./Repository";
import { Statuses } from "./Statuses";

declare var StatusOptions: Github.ReposCreateStatusParams;

export { Commit, CommitStatus, Repository, Statuses, StatusOptions };
