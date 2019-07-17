import {
  CommonServiceIds,
  IProjectPageService,
} from 'azure-devops-extension-api/Common/CommonServices';
import * as SDK from 'azure-devops-extension-sdk';
import { useEffect, useState } from 'react';
import { ConfigurationStorage, ConfigurationType } from '../../common/storage.service';

function useConfigurationStorage(): [
  object,
  string,
  boolean,
  (value: string) => void,
  () => Promise<void>
] {
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
        'User Story'
      );
      const cascade = await configStorageService.getConfiguration();
      setConfig(cascade);
      setConfigText(JSON.stringify(cascade, null, 2));
    })();
  }, []);

  async function updateConfigurationStorage() {
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
      'User Story'
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

export { useConfigurationStorage };
