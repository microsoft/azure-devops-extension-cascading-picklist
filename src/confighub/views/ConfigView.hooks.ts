import {
  CommonServiceIds,
  IProjectPageService,
} from 'azure-devops-extension-api/Common/CommonServices';
import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';
import { useEffect, useState } from 'react';
import { WorkItemType } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { getClient } from 'azure-devops-extension-api';
import {
  ManifestService,
  ManifestValidationService,
  IManifestValidationError,
} from '../../common/manifest.service';

interface IStatus {
  status: boolean;
  errors: IManifestValidationError[];
}

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

  function saveDraft(value: string): void {
    try {
      const parsedConfig: Object = JSON.parse(value);
      const manifestValidationService = new ManifestValidationService(parsedConfig);
      const errors = manifestValidationService.validate();
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
        errors: [],
      });
    }
    setConfigText(value);
  }

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
        manifest = await manifestService.createDefaultManifest();
      }

      saveDraft(JSON.stringify(manifest, null, 2));
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

export { useConfigurationStorage, useFetchWorkItemTypes, IStatus };
