import { useEffect, useState } from 'react';
import { ScopeType, CascadingConfigurationStorageService } from '../../common/storage.service';

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
      const storageService = new CascadingConfigurationStorageService(
        'configuration',
        ScopeType.Default
      );
      const cascade = await storageService.getCascadingConfiguration();
      setConfig(cascade);
      setConfigText(JSON.stringify(cascade, null, 2));
    })();
  }, []);

  async function updateConfigurationStorage() {
    if (!status) {
      throw new Error('Configuration is invalid');
    }
    const storageService = new CascadingConfigurationStorageService(
      'configuration',
      ScopeType.Default
    );
    const cascade = await storageService.writeCascadingConfiguration(config);
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
