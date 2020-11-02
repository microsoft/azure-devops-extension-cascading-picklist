import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { FieldTableItem } from '../components/FieldsTable';
import { IProjectPageService, CommonServiceIds, getClient } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';

function getFieldPicklistsList(useProject: boolean = true): FieldTableItem[] {
    return getPicklistsFieldsList(useProject);
}

function getPicklistsFieldsList(useProject: boolean = true): FieldTableItem[] {
  const [fields, setFields] = useState<FieldTableItem[]>([]);

  useEffect(() => {
    (async () => {
      let projectId: string = null;

      if(useProject == true)
      {
        const projectInfoService = await SDK.getService<IProjectPageService>(
          CommonServiceIds.ProjectPageService
        );
        const project = await projectInfoService.getProject();

        projectId = project.id;
      }
      
      const witRestClient = await getClient(WorkItemTrackingRestClient);
      const fields = (useProject) ? await witRestClient.getFields(projectId) : await witRestClient.getFields();
      
      setFields(
        fields
          .filter(field => field.isPicklist || field.isPicklistSuggested)
          .map(field => ({ name: field.name, reference: field.referenceName }))
      );
    })();
  }, []);

  return fields;
}

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

export { getFieldPicklistsList, useProjectPicklistsList };
