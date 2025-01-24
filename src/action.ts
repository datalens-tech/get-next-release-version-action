import { Octokit } from "@octokit/rest";

import { VersionShiftLiteral } from "./version/models";

export interface ActionResult {
  version: string;
}

interface LogFunction {
  (message: string): void;
}

interface ActionOptions {
  versionShift: VersionShiftLiteral;
  versionTemplate: string;
  versionOverride: string;
  releaseVersionRegexp: RegExp;
  releaseFilterTargetCommitish: string;
  releaseFilterPrerelease: boolean | null;
  releaseFilterDraft: boolean | null;
  githubOwner: string;
  githubRepo: string;
  githubToken: string;
  logger: LogFunction;
}

interface Release {
  tagName: string;
  targetCommitish: string;
  prerelease: boolean;
  draft: boolean;
}

class GitHubClient {
  static fromGithubToken(githubToken: string, logger: LogFunction): GitHubClient {
    return new GitHubClient(
      new Octokit({
        auth: githubToken,
      }),
      logger,
    );
  }

  private readonly octokitClient: Octokit;
  private readonly logger: LogFunction;

  constructor(octokitClient: Octokit, logger: LogFunction) {
    this.octokitClient = octokitClient;
    this.logger = logger;
  }

  async getReleases(owner: string, repo: string, perPage: number, page: number): Promise<Release[]> {
    const data = await this.octokitClient.repos.listReleases({
      owner,
      repo,
      per_page: perPage,
      page,
    });

    return data.data.map((release) => ({
      tagName: release.tag_name,
      targetCommitish: release.target_commitish,
      prerelease: release.prerelease,
      draft: release.draft,
    }));
  }

  async compareCommits(owner: string, repo: string, base: string, head: string): Promise<string> {
    const data = await this.octokitClient.repos.compareCommits({
      owner,
      repo,
      base,
      head,
    });

    return data.data.status;
  }

  async getLatestRelease(
    owner: string,
    repo: string,
    targetCommitish: string,
    prerelease: boolean | null,
    draft: boolean | null,
    releaseVersionRegexp: RegExp,
  ): Promise<Release> {
    let page = 1;
    const perPage = 100;

    while (true) {
      const releases = await this.getReleases(owner, repo, perPage, page);
      this.logger(`Fetched ${releases.length} releases from page ${page}`);

      for (const release of releases) {
        if (targetCommitish !== "") {
          const status = await this.compareCommits(owner, repo, targetCommitish, release.tagName);
          if (status !== "behind" && status !== "identical") {
            this.logger(
              `Skipping release ${release.tagName} because it is not based on the target commitish(${targetCommitish})`,
            );
            continue;
          }
        }

        if (prerelease !== null && release.prerelease !== prerelease) {
          this.logger(
            `Skipping release ${release.tagName} because prerelease status does not match, expected ${prerelease}, got ${release.prerelease}`,
          );
          continue;
        }

        if (draft !== null && release.draft !== draft) {
          this.logger(
            `Skipping release ${release.tagName} because draft status does not match, expected ${draft}, got ${release.prerelease}`,
          );
          continue;
        }

        if (!releaseVersionRegexp.test(release.tagName)) {
          this.logger(
            `Skipping release ${release.tagName} because it does not match the version regexp(${releaseVersionRegexp})`,
          );
          continue;
        }

        return release;
      }

      if (releases.length < perPage) {
        break;
      }

      page += 1;
    }

    throw new Error(`No matching release found`);
  }
}

function shiftVersion(version: string, regexp: RegExp, shift: VersionShiftLiteral, template: string): string {
  const match = version.match(regexp);
  if (!match || !match.groups) {
    throw new Error(`Invalid version: ${version}`);
  }

  let { major, minor, patch } = match.groups;

  if (!major || !minor || !patch) {
    throw new Error(`Invalid version: ${version}`);
  }

  switch (shift) {
    case "major":
      major = (parseInt(major, 10) + 1).toString();
      minor = "0";
      patch = "0";
      break;
    case "minor":
      minor = (parseInt(minor, 10) + 1).toString();
      patch = "0";
      break;
    case "patch":
      patch = (parseInt(patch, 10) + 1).toString();
      break;
  }

  return template.replace("{major}", major).replace("{minor}", minor).replace("{patch}", patch);
}

export class Action {
  static fromOptions(actionOptions: ActionOptions): Action {
    return new Action(actionOptions);
  }

  private readonly options: ActionOptions;

  constructor(actionOptions: ActionOptions) {
    this.options = actionOptions;
  }

  async run(): Promise<ActionResult> {
    if (this.options.versionOverride !== "") {
      return { version: this.options.versionOverride };
    }

    const githubClient = GitHubClient.fromGithubToken(this.options.githubToken, this.options.logger);
    const latestRelease = await githubClient.getLatestRelease(
      this.options.githubOwner,
      this.options.githubRepo,
      this.options.releaseFilterTargetCommitish,
      this.options.releaseFilterPrerelease,
      this.options.releaseFilterDraft,
      this.options.releaseVersionRegexp,
    );

    const newVersion = shiftVersion(
      latestRelease.tagName,
      this.options.releaseVersionRegexp,
      this.options.versionShift,
      this.options.versionTemplate,
    );

    return { version: newVersion };
  }
}
