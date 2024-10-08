# Cascading Picklists Extension

Have you ever wanted to have a picklist show only subset of values depending on the value of another field? For example maybe you two fields to track a release, major and minor release. The minor release values are tied to the major release values. In the example below, if the major release is "Blue" then only show the Blue minor releases. And when the major release of "Red" is selected, then only show the Red minor releases.

# Documentation 

For detailed instructions on using the Cascading Picklists Extension Azure DevOps extension, please refer to the official documentation. You can access the comprehensive guide by clicking [Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.cascading-picklists-extension). This resource provides step-by-step information to help you effectively utilize the Cascading Picklists Extension features within your Azure DevOps environment.

> Note that the extension is only supported on Azure DevOps Service. Is it is currently not supported on-prem yet due to a missing API.

# Support

## How to file issues and get help

This project uses [GitHub Issues](https://github.com/microsoft/azure-devops-extension-cascading-picklist/issues) to track bugs and feature requests. Please search the existing issues before filing new issues to avoid duplicates. For new issues, file your bug or feature request as a new Issue. 

## Microsoft Support Policy
Support for this project is limited to the resources listed above.

# Contributing

We welcome contributions to improve the extension. If you would like to contribute, please fork the repository and create a pull request with your changes. Your contributions help enhance the functionality and usability of the extension for the entire community.

This extension uses the `ms.vss-work-web.work-item-form` contribution point that enables you to build a cascading picklist on the work item form. See https://learn.microsoft.com/en-us/azure/devops/extend/develop/add-workitem-extension?view=azure-devops for more information about how work item form extensibility works.

**Note:** do not publish the extension as a public extension under a different publisher as this will create a clone of the extension and it will be unclear to the 
community which one to use. If you feel you don't want to contribute to this repository then publish a private version for your use-case.

Check out https://learn.microsoft.com/en-us/azure/devops/extend/get-started to learn how to develop Azure DevOps extensions

### Developing and Testing

```bash
# Install node dependencies
npm install

# Compile the source code
npm run start

# Build the extension
npm run build-dev
```
## About Microsoft DevLabs

Microsoft DevLabs is an outlet for experiments from Microsoft, experiments that represent some of the latest ideas around developer tools. Solutions in this
category are designed for broad usage, and you are encouraged to use and provide feedback on them; however, these extensions are not supported nor are any
commitments made as to their longevity.