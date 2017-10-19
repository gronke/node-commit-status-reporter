import * as Github from "github";

import Commit from "./Commit";
import CommitStatus from "./CommitStatus";
import Repository from "./Repository";
import { Statuses } from "./Statuses";

declare var StatusOptions: Github.ReposCreateStatusParams;

export { Commit, CommitStatus, Repository, Statuses, StatusOptions };
