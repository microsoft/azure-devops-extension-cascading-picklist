# Cascading Picklists

Create a cascading picklist between two picklists fields. 

#### Overview

Have you ever wanted to have a picklist show only subset of values depending on the value of another field? For example maybe you two fields to track a release, major and minor release. The minor release values are tied to the major release values. In the example below, If the major release is "Blue" then only show the Blue minor releases. And when the major releae of "Red" is selected, the only show the Red minor releases.

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
2. Add all the possible value for the minor release. This should include values for both Blue and Red releases

   ![minor release picklist](dist/images/picklist-child.png "Configure Picklist")

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

If you are a scrum team that sets iteration on each user story then you will be incentivized, because we rollup child user story iterations to its parent feature, yes you are rewarded for planning your child user stories.

If you are a kanban team and does not set iterations for your user story, plan when your features will tentatively start/finish by manually extending your features sprints.

![Manual planning](dist/images/png3.gif "Manual Planning")

#### Supported Features

-   Custom calendar views
-   Plan
-   Track progress

# Epic Roadmap (Beta)
