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

function useConfigurationStorage(
  workItemTypeName: string
): [object, string, boolean, (value: string) => void, () => Promise<void>] {
  const [config, setConfig] = useState({});
  const [configText, setConfigText] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    (async function() {
      const projectInfoService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectInfoService.getProject();

      const manifestService = new ManifestService(project.id, workItemTypeName);

      try {
        const manifest = await manifestService.getManifest();
        if (manifest === undefined) {
          setConfig({});
          setConfigText('');
        } else {
          setConfig(manifest);
          setConfigText(JSON.stringify(manifest, null, 2));
        }
      } catch (error) {
        setConfig({});
        setConfigText('');
      }
    })();
  }, [workItemTypeName]);

  async function updateConfigurationStorage() {
    // TODO: make status validation within a hook rather that trust a component.
    if (!status) {
      throw new Error('Configuration is invalid');
    }
    const projectInfoService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectInfoService.getProject();
    const manifestService = new ManifestService(project.id, workItemTypeName);
    const manifest = await manifestService.updateManifest(config);
    setConfig(manifest);
  }

  function saveConfig(value: string): void {
    try {
      const parsedConfig = JSON.parse(value);
      setStatus(true);
      setConfigText(value);
      setConfig(parsedConfig);
    } catch (error) {
      setConfigText(value);
      setStatus(false);
    }
  }

  return [config, configText, status, saveConfig, updateConfigurationStorage];
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
