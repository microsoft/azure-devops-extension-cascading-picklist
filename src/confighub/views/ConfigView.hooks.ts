import {
  CommonServiceIds,
  IProjectPageService,
} from 'azure-devops-extension-api/Common/CommonServices';
import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';
import { useEffect, useState } from 'react';
import { WorkItemType } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { getClient } from 'azure-devops-extension-api';
import { ManifestService } from '../../common/manifest.service';

function useConfigurationStorage(): [
  string,
  boolean,
  (value: string) => void,
  () => Promise<void>
] {
  const [config, setConfig] = useState({});
  const [configText, setConfigText] = useState('');
  const [status, setStatus] = useState(true);

  function saveDraft(value: string): void {
    try {
      const parsedConfig = JSON.parse(value);
      setConfig(parsedConfig);
      setStatus(true);
    } catch (error) {
      setStatus(false);
    }
    setConfigText(value);
  }

  async function publishConfig(): Promise<void> {
    if (!status) {
      throw new Error('Configuration is invalid');
    }
    
    const projectInfoService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectInfoService.getProject();
    const manifest = await new ManifestService(project.id).updateManifest(config);
    setConfig(manifest);
  }

  useEffect(() => {
    (async function() {
      const projectInfoService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectInfoService.getProject();
      const manifestService = new ManifestService(project.id);

      try {
        const manifest = await manifestService.getManifest();
        if (manifest === undefined) {
          saveDraft('');
        } else {
          saveDraft(JSON.stringify(manifest, null, 2));
        }
      } catch (error) {
        saveDraft('');
      }
    })();
  }, []);

  return [configText, status, saveDraft, publishConfig];
}

function useFetchWorkItemTypes(): WorkItemType[] {
  const [workItemTypes, setWorkItemTypes] = useState([]);

  useEffect(() => {
    (async () => {
      const projectInfoService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectInfoService.getProject();

      const witRestClient = await getClient(WorkItemTrackingRestClient);
      const witTypes = await witRestClient.getWorkItemTypes(project.name);
      setWorkItemTypes(witTypes);
    })();
  }, []);

  return workItemTypes;
}

export { useConfigurationStorage, useFetchWorkItemTypes };
