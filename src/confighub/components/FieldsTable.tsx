import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import {
  ColumnFill,
  ISimpleTableCell,
  renderSimpleCell,
  Table,
  TableColumnLayout,
} from 'azure-devops-ui/Table';
import { IItemProvider } from 'azure-devops-ui/Utilities/Provider';
import * as React from 'react';

export const tableDefinition = [
  {
    columnLayout: TableColumnLayout.singleLinePrefix,
    id: 'name',
    name: 'Name',
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(400),
  },
  {
    id: 'reference',
    name: 'Reference Name',
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(600),
  },
  ColumnFill,
];

interface FieldTableItem extends ISimpleTableCell {
  name: string;
  reference: string;
}

interface FieldsTableProps {
  itemProvider: IItemProvider<FieldTableItem>;
}

const FieldsTable: React.FC<FieldsTableProps> = ({ itemProvider }) => (
  <Table
    columns={tableDefinition}
    itemProvider={itemProvider}
    selectableText={true}
    role='table'
    pageSize={itemProvider.length}
  />
);

export { FieldsTable, FieldTableItem };
