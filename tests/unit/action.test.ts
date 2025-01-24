import { describe, expect, test } from "vitest";

import { Action } from "../../src/action";

const defaultActionOptions = {
  versionShift: "major" as const,
  versionOverride: "",
  versionTemplate: "v{major}.{minor}.{patch}",
  releaseVersionRegexp: /.*/,
  releaseFilterTargetCommitish: "main",
  releaseFilterPrerelease: null,
  releaseFilterDraft: null,
  githubOwner: "test_owner",
  githubRepo: "test_repo",
  githubToken: "test_token",
  logger: console.info, // eslint-disable-line no-console
};

describe("Action tests", () => {
  test("action with version_override", async () => {
    const action = Action.fromOptions({
      ...defaultActionOptions,
      versionOverride: "v1.2.3",
    });
    const result = await action.run();
    expect(result).toEqual({ version: "v1.2.3" });
  });
});
