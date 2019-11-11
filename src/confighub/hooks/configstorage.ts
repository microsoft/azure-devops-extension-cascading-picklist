import { CommonServiceIds, IProjectPageService } from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';
import { useCallback, useEffect, useState } from 'react';
import {
  IManifestValidationError,
  ManifestService,
  ManifestValidationService,
  ValidationErrorCode,
} from '../../common/manifest.service';

interface IStatus {
  status: boolean;
  errors: IManifestValidationError[];
}

const manifestValidationService = new ManifestValidationService();

function useConfigurationStorage(): [
  string,
  IStatus,
  (value: string) => void,
  () => Promise<void>
] {
  const [config, setConfig] = useState<Object>({});
  const [configText, setConfigText] = useState<string>('');
  const [status, setStatus] = useState<IStatus>({
    status: true,
    errors: [],
  });

  async function validateDraft(value: string): Promise<void> {
    try {
      const parsedConfig: Object = JSON.parse(value);
      const errors = await manifestValidationService.validate(parsedConfig);
      if (errors && errors.length > 0) {
        setStatus({
          status: false,
          errors: errors,
        });
      } else {
        setConfig(parsedConfig);
        setStatus({
          status: true,
          errors: [],
        });
      }
    } catch (error) {
      setStatus({
        status: false,
        errors: [
          {
            code: ValidationErrorCode.SyntaxError,
            description: 'Config syntax error',
          },
        ],
      });
    }
  }

  const saveDraft = useCallback(function(value: string): void {
    setConfigText(value);
    validateDraft(value);
  }, []);

  async function publishConfig(): Promise<void> {
    if (!status.status) {
      throw new Error(`${status.errors.map(error => error.description).join(';')}`);
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
      let manifest = await manifestService.getManifest();
      if (manifest == null) {
        manifest = Object.assign({}, ManifestService.defaultManifest);
      }

      saveDraft(JSON.stringify(manifest, null, 2));
    })();
  }, [saveDraft]);

  return [configText, status, saveDraft, publishConfig];
}

export { useConfigurationStorage, IStatus };
