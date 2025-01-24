# Get Next Release Version Action

[![CI](https://github.com/datalens-tech/get-next-release-version-action/workflows/Check%20PR/badge.svg)](https://github.com/datalens-tech/get-next-release-version-action/actions?query=workflow%3A%22%22Check+PR%22%22)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Get%20Next%20Release%20Version-blue.svg)](https://github.com/marketplace/actions/get-next-release-version)

Action for automatically generate next release version

Get Next Release Version Action

## Usage

### Example

```yaml
jobs:
  get-next-release-version:
    permissions:
      contents: read # use 'write' if you need draft releases to be used (gh api doesn't provide draft releases for read-only tokens)
    outputs:
      version: ${{ steps.get_version.outputs.version }}

    steps:
      - name: Get Next Release Version
        id: get-next-release-version
        uses: datalens-tech/get-next-release-version-action@v1
        with:
          version_shift: patch
          version_override: v1.0.0
          release_filter_target_commitish: main
```

### Action Inputs

| Name                              | Description                                                                                            | Default                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `version_shift`                   | Version shift, used to calculate next version `[major, minor, patch]`.                                 | `minor`                                                     |
| `version_template`                | Version template to use for version parsing, must contain named groups `<major>`, `<minor>`, `<patch>` | `v$<major>.$<minor>.$<patch>`                               |
| `version_override`                | Version override, if used then will be output directly.                                                |                                                             |
| `release_version_regexp`          | Version regexp to use for version parsing, must contain named groups 'major', 'minor', 'patch'.        | `v?(?<major>[0-9]+)\.(?<minor>[0-9]+)\.(?<patch>[0-9]+).*$` |
| `release_filter_target_commitish` | Target commitish filter for latest release.                                                            |                                                             |
| `release_filter_prerelease`       | Prerelease filter for latest release.                                                                  |                                                             |
| `release_filter_draft`            | Draft filter for latest release.                                                                       |                                                             |
| `github_owner`                    | GitHub owner.                                                                                          | `${{ github.repository_owner }}`                            |
| `github_repo`                     | GitHub repository.                                                                                     | `${{ github.event.repository.name }}`                       |
| `github_token`                    | GitHub token.                                                                                          | `${{ github.token }}`                                       |

### Action Outputs

| Name      | Description           |
| --------- | --------------------- |
| `version` | Next release version. |

## Development

### Global dependencies

- [Taskfile](https://taskfile.dev/installation/)
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)

### Taskfile commands

For all commands see [Taskfile](Taskfile.yaml) or `task --list-all`.

## License

[MIT](LICENSE)
