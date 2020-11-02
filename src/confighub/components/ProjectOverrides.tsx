import { Button } from 'azure-devops-ui/Button';
import { ScrollableList, IListItemDetails, ListSelection, ListItem, SimpleList } from "azure-devops-ui/List";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Card } from "azure-devops-ui/Card";
import {
  CustomHeader,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize,
} from 'azure-devops-ui/Header';
import { IStatusProps, Status, Statuses, StatusSize } from 'azure-devops-ui/Status';
import * as React from 'react';
import styled from 'styled-components';
import { IStatus } from '../hooks/configstorage';
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Toggle } from "azure-devops-ui/Toggle";

interface IProjectOverridesProps {
  isVisible: boolean;
  toggle: ObservableValue<boolean>;
  //onToggleClick: () => void | Promise<void>;
}

const HeaderSideContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin: 0 1rem 0 1rem;
  }
`;
const ProjectOverridesViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const ProjectOverrides = ({ isVisible, toggle }: IProjectOverridesProps) => {
  if(isVisible == true)
  {
    return (
      <ProjectOverridesViewContainer>
        <Card className="flex-grow" >
            Configure the JSON rules that drive how the cascading picklist would work. 
            This is inherited from the Organization level unless overriden here.   
        </Card>
        <Toggle
            onText={"Override Organization Cascading rules"}
            offText={"Override Organization Cascading rules"}
            checked={toggle}
            onChange={(event, value) => (toggle.value = value)}
        />
      </ProjectOverridesViewContainer>
    );
  }
  else
  {
    return (
      <Card className="flex-grow" >
          Configure the JSON rules that drive how the cascading picklist would work. This will be applied to
          all Projects unless overriden at the Project level.   
      </Card>);
  }
};

export { ProjectOverrides, IProjectOverridesProps };
