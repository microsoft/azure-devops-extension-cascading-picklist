# Cascading Picklists

Have you ever wanted to have a picklist show only subset of values depending on the value of another field? For example maybe you two fields to track a release, major and minor release. The minor release values are tied to the major release values. In the example below, if the major release is "Blue" then only show the Blue minor releases. And when the major release of "Red" is selected, then only show the Red minor releases.


# Documentation

**Release Blue**

- Blue.1
- Blue.2
- Blue.3

**Release Red**

- Red.A
- Red.B
- Red.C

#### How does it work?

1. Create the custom fields for both the parent (major release) and child (minor release) picklists
2. Add all the possible values for the minor release. This should include values for both Blue and Red releases

   ![minor release picklist](images/picklist-child.png 'Configure Picklist')

3. Open the "Cascading List" hub in project settings. From here you can configure the JSON rules that drive how the cascading picklist would work. Below is the sample for Major and Minor releases.

   ```
   {
     "version": "1.0",
     "cascades": {
       "Custom.MajorRelease": {
         "Release Blue": {
           "Custom.MinorRelease": [
             "Blue.1",
             "Blue.2",
             "Blue.3"
           ]
         },
         "Release Red": {
           "Custom.MinorRelease": [
             "Red.A",
             "Red.B",
             "Red.C"
           ]
         }
       }
     }
   }
   ```

4. Go create a new Feature work item to see it in action. Select "Release Blue" and notice how only the blue values are displayed in the Minor Release field. Select "Release Red" and you will only see the Red minor release items.

   ![picklist demo](images/picklist-demo.gif 'picklist demo')

#### Supported Features

- Setup cascading picklist between two fields

#### Known issues

- Work item forms with many extensions installed can delay the loading of the cascading picklist extension. Therefore the child/parent relationship may not be visible for several seconds. If that happens, we recommend that you remove any non-essential extensions from the form.

# Support

## How to file issues and get help

This project uses [GitHub Issues](https://github.com/microsoft/azure-devops-extension-cascading-picklist/issues) to track bugs and feature requests. Please search the existing issues before filing new issues to avoid duplicates. For new issues, file your bug or feature request as a new Issue. 

## Microsoft DevLabs
Microsoft DevLabs is an outlet for experiments from Microsoft, experiments that represent some of the latest ideas around developer tools. Solutions in this category are designed for broad usage, and you are encouraged to use and provide feedback on them; however, these extensions are not supported nor are any commitments made as to their longevity.

