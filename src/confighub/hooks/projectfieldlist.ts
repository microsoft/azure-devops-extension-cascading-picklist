import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { FieldTableItem } from '../components/FieldsTable';
import { IProjectPageService, CommonServiceIds, getClient } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

function useProjectPicklistsList(): FieldTableItem[] {
  const [fields, setFields] = useState<FieldTableItem[]>([]);

  useEffect(() => {
    (async () => {
      const projectInfoService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectInfoService.getProject();
      const witRestClient = await getClient(WorkItemTrackingRestClient);
      const fields = await witRestClient.getFields(project.id);
      setFields(
        fields
          .filter(field => field.isPicklist || field.isPicklistSuggested)
          .map(field => ({ name: field.name, reference: field.referenceName }))
      );
    })();
  }, []);

  return fields;
}

export { useProjectPicklistsList };
