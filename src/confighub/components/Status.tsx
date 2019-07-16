import * as React from 'react';
import { Icon, IconSize } from 'azure-devops-ui/Icon';

interface IStatusProps {
  isOk: boolean;
}

const Status = (props: IStatusProps) => {
  const icon = props.isOk ? 'CheckMark' : 'Cancel';
  const color = props.isOk ? '#107c10' : '#d83b01';
  return (
    <span>
      Syntax:{' '}
      <Icon size={IconSize.medium} style={{ color }} ariaLabel='chackmart' iconName={icon} />{' '}
    </span>
  );
};

export default Status;
