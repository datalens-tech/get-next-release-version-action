import { parseNonEmptyString, parseNullableBoolean, parseString } from "./utils/parse";
import { VersionShiftLiteral, parseVersionShift } from "./version/models";

export interface RawActionInput {
  version_shift: string;
  version_override: string;
  version_template: string;
  release_version_regexp: string;
  release_filter_target_commitish: string;
  release_filter_prerelease: string;
  github_owner: string;
  github_repo: string;
  github_token: string;
}

export interface ActionInput {
  versionShift: VersionShiftLiteral;
  versionTemplate: string;
  versionOverride: string;
  releaseVersionRegexp: RegExp;
  releaseFilterTargetCommitish: string;
  releaseFilterPrerelease: boolean | null;
  githubOwner: string;
  githubRepo: string;
  githubToken: string;
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  return {
    versionShift: parseVersionShift(raw.version_shift),
    versionTemplate: parseNonEmptyString(raw.version_template),
    versionOverride: parseString(raw.version_override),
    releaseVersionRegexp: new RegExp(parseNonEmptyString(raw.release_version_regexp)),
    releaseFilterTargetCommitish: parseString(raw.release_filter_target_commitish),
    releaseFilterPrerelease: parseNullableBoolean(raw.release_filter_prerelease),
    githubOwner: parseNonEmptyString(raw.github_owner),
    githubRepo: parseNonEmptyString(raw.github_repo),
    githubToken: parseNonEmptyString(raw.github_token),
  };
}
