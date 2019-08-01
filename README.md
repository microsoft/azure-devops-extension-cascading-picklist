# cascading-picklists-extension

This extension can be found in the [Azure DevOps Marketplace](http://marketplace.visualstudio.com)

## Cascading Picklists

This extension uses the `ms.vss-work-web.work-item-form` contribution point that enables you to build a cascading picklist on the work item form. Cascading picklists are made up of two seperate fields. The parent field and a child field. The parent picklist will contain a list of values, that when a value is selected, will display the values in the child list.

![image](./images/picklist-demo.gif)

### Create a picklist

First, create a picklist of parent values. Second, create a picklist of child values. This child picklist will contain **all** possible values. We will configure how those values get displayed in the extension configuration.

![image](./images/picklist-child.png)

### Configure

Once both picklists have been created and configured, you can configure what child picklist values will be displayed. You do this by going to the "Cascading Lists" Hub in project settings. From here, configure the value for the parent picklist, so that when selected, the child values will be displayed.

![image](./images/settings-hub-1.png)

#### Tips

1. You must know the refname of the custom picklist fields. You can use [List Fields REST API](https://docs.microsoft.com/en-us/rest/api/azure/devops/wit/fields/list?view=azure-devops-rest-5.0) if you need help finding the value.

2. The values setup in the picklist and the values in the configuration must be an exact match. There is not validation to check or correct spelling mistakes.

## Get started with Extensions

Building and testing the extension requires following.

1.  [Download and install nodejs](http://nodejs.org 'nodejs')
2.  [webpack](https://webpack.js.org/)
3.  [tfx cli](https://docs.microsoft.com/en-us/vsts/extend/publish/command-line?view=vsts)
4.  [TypeScript](https://www.typescriptlang.org/)

```
npm i -g typescript tfx-cli webpack-cli
```

Install dev prerequisites

```
npm install
```

### Create vsix to deploy on test environment

```
webpack && npm run package:dev:http
```

### Run the extension server locally

Execute following commands in two separate Command Prompts

```
webpack --watch
npm run dev:http
```

### Publish the dev extension to marketplace

Follow the instructions here

[Package, publish, unpublish, and install VSTS extensions
](https://docs.microsoft.com/en-us/vsts/extend/publish/overview?view=vsts)

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
