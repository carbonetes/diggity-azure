# Azure DevOps Plugin: Diggity

## Introduction

**[Diggity](https://github.com/carbonetes/diggity)** provides organizations with a more comprehensive look at their application to take calculated actions and create a better security approach. Its primary purpose is to scan vulnerabilities to implement subsequent risk mitigation measures.

## Task Usage

### Docker image scan example

```yaml
- task: Diggity@1
  inputs:
    scanType: 'image'
    scanName: 'ubuntu:latest'
    failCriteria: 'medium'
    skipBuildFail: 'false'
```

## Prerequisites

- **Docker Plugin** for image pulling.

## Inputs Description

| Input Name                  | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| scanType \*                 | Select Scan Type: image, tar, or directory. | 
| scanName \*                 | Input image name `image:tag`, tar file path, or directory path. |
| failCriteria \*             | Input a severity that will be found at or above given severity([unknown negligible low medium high critical]). Default: `medium`. |
| skipBuildFail \*            | Default as false. Skip build to fail based on the assessment. |

_\* = required inputs._


## Output Description

| Table                        | Description                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| Vulnerability Scan           | Show list of vulnerabilities found. |
| Recommendation               | Show available recommendation to fix vulnerabilities. |
| Assessment                   | Based on fail-criteria severity. Pass-Fail Assessment. |

## Pipeline

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: Diggity@1
  inputs:
    scanType: 'directory'           // Select Scan Type, image, directory, tar, or sbom.
    scanName: '.'                   // Input Image name, Directory path, tar file path.
    failCriteria: 'medium'          // Select a threshold that will fail the build when equal to or above the severity found in the results. 
                                    // Select Severity, critical, high, medium, low, negligible, unknown.
    skipBuildFail: 'false'          // Default as false. Skip build to fail based on the assessment.
```

## Support
To help with this task extension, or have an issue or feature request, please contact: [eng@carbonetes.com](eng@carbonetes.com)

If reporting an issue, please include:

* the version of the task extension
* relevant logs and error messages
* steps to reproduce

## License and Copyright

Licensed under [MIT License](LICENSE).