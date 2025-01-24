import { getInput, info, setFailed, setOutput } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";

function getActionInput(): ActionInput {
  return parseActionInput({
    version_shift: getInput("version_shift"),
    version_template: getInput("version_template"),
    version_override: getInput("version_override"),
    release_version_regexp: getInput("release_version_regexp"),
    release_filter_target_commitish: getInput("release_filter_target_commitish"),
    release_filter_prerelease: getInput("release_filter_prerelease"),
    release_filter_draft: getInput("release_filter_draft"),
    github_owner: getInput("github_owner"),
    github_repo: getInput("github_repo"),
    github_token: getInput("github_token"),
  });
}

function setActionOutput(actionResult: ActionResult): void {
  info(`Action result: ${JSON.stringify(actionResult)}`);
  setOutput("version", actionResult.version);
}

async function _main(): Promise<void> {
  const actionInput = getActionInput();
  const actionInstance = Action.fromOptions({
    ...actionInput,
    logger: info,
  });
  const actionResult = await actionInstance.run();
  setActionOutput(actionResult);
}

async function main(): Promise<void> {
  try {
    _main();
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed("An unexpected error occurred");
    }
  }
}

main();
