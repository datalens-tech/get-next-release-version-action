import { describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  version_shift: "major",
  version_template: "v{major}.{minor}.{patch}",
  version_override: "v1.2.3",
  release_version_regexp: ".*",
  release_filter_target_commitish: "test_commitish",
  release_filter_prerelease: "true",
  github_owner: "test_owner",
  github_repo: "test_repo",
  github_token: "test_token",
};

function createRawInput(overrides: Partial<RawActionInput> = {}): RawActionInput {
  return {
    ...defaultRawInput,
    ...overrides,
  };
}

describe("Input tests", () => {
  test("parses raw input correctly", () => {
    expect(parseActionInput(createRawInput())).toEqual({
      versionShift: "major",
      versionTemplate: "v{major}.{minor}.{patch}",
      versionOverride: "v1.2.3",
      releaseVersionRegexp: /.*/,
      releaseFilterTargetCommitish: "test_commitish",
      releaseFilterPrerelease: true,
      githubOwner: "test_owner",
      githubRepo: "test_repo",
      githubToken: "test_token",
    });
  });

  test("throws error when version_shift is empty", () => {
    expect(() => parseActionInput(createRawInput({ version_shift: "" })).versionShift).toThrowError();
  });

  test("throws error when version_shift is invalid", () => {
    expect(() => parseActionInput(createRawInput({ version_shift: "invalid" })).versionShift).toThrowError();
  });

  test("throws error when release_version_regexp is empty", () => {
    expect(() => parseActionInput(createRawInput({ release_version_regexp: "" })).releaseVersionRegexp).toThrowError();
  });

  test("throws error when release_version_regexp is invalid", () => {
    expect(() => parseActionInput(createRawInput({ release_version_regexp: "(" })).releaseVersionRegexp).toThrowError();
  });

  test("parses empty version_override correctly", () => {
    expect(parseActionInput(createRawInput({ version_override: "" })).versionOverride).toBe("");
  });

  test("parses undefined version_override correctly", () => {
    expect(parseActionInput(createRawInput({ version_override: undefined })).versionOverride).toBe("");
  });

  test("parses empty release_filter_target_commitish correctly", () => {
    expect(parseActionInput(createRawInput({ release_filter_target_commitish: "" })).releaseFilterTargetCommitish).toBe(
      "",
    );
  });

  test("parses empty release_filter_prerelease correctly", () => {
    expect(parseActionInput(createRawInput({ release_filter_prerelease: "" })).releaseFilterPrerelease).toBe(null);
  });

  test("throws error when github_owner is empty", () => {
    expect(() => parseActionInput(createRawInput({ github_owner: "" })).githubOwner).toThrowError();
  });

  test("throws error when github_repo is empty", () => {
    expect(() => parseActionInput(createRawInput({ github_repo: "" })).githubRepo).toThrowError();
  });

  test("throws error when github_token is empty", () => {
    expect(() => parseActionInput(createRawInput({ github_token: "" })).githubToken).toThrowError();
  });
});
