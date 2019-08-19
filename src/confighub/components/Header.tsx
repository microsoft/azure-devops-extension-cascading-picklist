import { Button } from 'azure-devops-ui/Button';
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

interface IHeaderProps {
  title: string;
  status: IStatus;
  onSaveClick: () => void | Promise<void>;
}

const HeaderSideContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin: 0 1rem 0 1rem;
  }
`;

const Header = ({ title, status, onSaveClick }: IHeaderProps) => {
  const statusProps: IStatusProps = status.status ? Statuses.Success : Statuses.Failed;

  return (
    <CustomHeader>
      <HeaderTitleArea>
        <HeaderTitleRow>
          <HeaderTitle titleSize={TitleSize.Large}>{title}</HeaderTitle>
        </HeaderTitleRow>
      </HeaderTitleArea>
      <HeaderSideContainer>
        <Button
          text='Save configuration'
          primary={true}
          onClick={onSaveClick}
          disabled={!status.status}
          tooltipProps={{ text: status.errors.map(error => error.description).join(',') }}
        />
        <Status {...statusProps} size={StatusSize.l} />
      </HeaderSideContainer>
    </CustomHeader>
  );
};

export { Header, IHeaderProps };
