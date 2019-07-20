import {
  CommonServiceIds,
  IProjectPageService,
} from 'azure-devops-extension-api/Common/CommonServices';
import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';
import { useEffect, useState } from 'react';
import { ConfigurationStorage, ConfigurationType } from '../../common/storage.service';
import { WorkItemType } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { getClient } from 'azure-devops-extension-api';

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
      const configStorageService = new ConfigurationStorage(
        ConfigurationType.Manifest,
        project.id,
        workItemTypeName
      );
      try {
        const cascade = await configStorageService.getConfiguration();
        if (cascade === undefined) {
          setConfig({});
          setConfigText('');
        } else {
          setConfig(cascade);
          setConfigText(JSON.stringify(cascade, null, 2));
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
    const configStorageService = new ConfigurationStorage(
      ConfigurationType.Manifest,
      project.id,
      workItemTypeName
    );
    const cascade = await configStorageService.setConfiguration(config);
    setConfig(cascade);
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
