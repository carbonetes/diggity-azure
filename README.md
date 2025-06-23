<p align="center">
<img src="assets/diggity-black.png">
</p>

[![Carbonetes-Diggity](https://img.shields.io/badge/carbonetes-diggity-%232f7ea3)](https://github.com/carbonetes/diggity)
[![Diggity-Azure](https://img.shields.io/badge/diggity-azure--devops--plugin-%232f7ea3)](https://marketplace.visualstudio.com/items?itemName=Carbonetes.diggity)

# Azure DevOps Plugin: Diggity

## Introduction

**[Diggity](https://github.com/carbonetes/diggity)** BOM Diggity is an open-source tool developed to streamline the critical process of generating a comprehensive Software Bill of Materials (SBOM) for Container Images and File Systems across various supported ecosystems.

## Pipeline Scripts: Image, Tar File, and Directory.

### Image Scanning Pipeline Script:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: Diggity@1
  inputs:
    token: ''
    scanType: 'image'
    scanName: 'ubuntu:latest'
    failCriteria: 'medium'
    skipBuildFail: 'false'
```

### Tar File Scanning Pipeline Script:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- script: |
    echo "Pulling Docker image: ubuntu"
    docker pull ubuntu
    echo "Saving image to ubuntu.tar"
    docker save ubuntu -o ubuntu.tar
  displayName: 'Pull and Save Docker Image'

- script: |
    echo "Listing generated tar file..."
    ls -lh ubuntu.tar
  displayName: 'List Tar File'

- task: Diggity@1
  inputs:
    token: ''
    scanType: 'tar'
    scanName: 'ubuntu.tar'
    failCriteria: 'medium'
    skipBuildFail: 'false'
```

### Cloned Repository Directory Scanning Script:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- script: |
    echo "Listing contents of the repository..."
    ls -la $(Build.SourcesDirectory)
  displayName: 'List Repo Directory'

- task: Diggity@1
  inputs:
    token: ''
    scanType: 'directory'
    scanName: '$(Build.SourcesDirectory)'
    failCriteria: 'medium'
    skipBuildFail: 'false'
```

## Prerequisites

- **Docker Plugin** for image pulling.

## Inputs Description

| Input Name                  | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| token \*                    | Carbonetes Personal Access Token. | 
| scanType \*                 | Select Scan Type: image, tar, or directory. | 
| scanName \*                 | Input image name `image:tag`, tar file path, or directory path. |
| failCriteria \*             | Input a severity that will be found at or above given severity ([unknown negligible low medium high critical]). Default: `medium`. |
| skipBuildFail \*            | Default as false. Skip build to fail based on the assessment. |

_\* = required inputs._

## Output Description

| Table                        | Description                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| SBOM Scan           | Show list of packages found. |
| Assessment                   | Based on fail-criteria exposed secrets. Pass-Fail Assessment. |

## Pipeline

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: Diggity@1
  inputs:
    token: ''                       # Carbonetes Personal Access Token
    scanType: 'directory'           # Select Scan Type: image, directory, tar.
    scanName: '.'                   # Input image name, directory path, tar file path.
    failCriteria: 'medium'          # Select a threshold that will fail the build when equal to or above the severity found in the results. 
                                    # Select Severity: critical, high, medium, low, negligible, unknown.
    skipBuildFail: 'false'          # Default as false. Skip build to fail based on the assessment.
```

## Support
To help with this task extension, or have an issue or feature request, please contact: (eng@carbonetes.com)

If reporting an issue, please include:

* the version of the task extension
* relevant logs and error messages
* steps to reproduce

## License and Copyright

Licensed under [MIT License](LICENSE).