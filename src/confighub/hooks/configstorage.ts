import { CommonServiceIds, IProjectPageService } from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';
import { useCallback, useEffect, useState } from 'react';
import {
  IManifestValidationError,
  ManifestService,
  ManifestValidationService,
  ValidationErrorCode,
} from '../../common/manifest.service';
import { ConfigurationStorage } from '../../common/storage.service';
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { IManifest, ICascadeSettings } from '../../common/types';

interface IStatus {
  status: boolean;
  errors: IManifestValidationError[];
}

const manifestValidationService = new ManifestValidationService();

function useConfigurationStorage(useProject: boolean = true, toggleValue: ObservableValue<boolean>): [
  string,
  (boolean) => Promise<void>,
  object,
  IStatus,
  (value: string) => void,
  () => Promise<void>
] {
  const [config, setConfig] = useState<Object>({});
  const [editorOptions, setEditorOptions] = useState<Object>({
    selectOnLineNumbers: true,
    readOnly: false
  });
  const [overrideFlag, setOverrideFlag] = useState<boolean>();
  const [overrideToggleControlValue, setOverrideToggle] = useState<ObservableValue<boolean>>(toggleValue);
  const [configText, setConfigText] = useState<string>('');
  const [status, setStatus] = useState<IStatus>({
    status: true,
    errors: [],
  });

  async function validateDraft(value: string): Promise<void> {
    try {
      console.log('validateDraft: Validating draft settings.');
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
            description: `Config syntax error ${error}`,
          },
        ],
      });
    }
  }

  const saveDraft = useCallback(function(value: string): void {
    console.log('saveDraft: Saving settings as draft.');
    setConfigText(value);
    validateDraft(value);
  }, []);

  async function publishConfig(): Promise<void> {
    if (!status.status) {
      throw new Error(`${status.errors.map(error => error.description).join(';')}`);
    }
    console.log('publishConfig: Saving settings.');
    let projectId: string = null;

    if(useProject == true)
    {
      const projectInfoService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectInfoService.getProject();
      projectId = project.id;
    }
    
    //const manifest = await new ManifestService(projectId).updateManifest(config);
    let settings: ICascadeSettings = { 
        overrideOrgSettings: ((useProject) ? overrideFlag : false),
        manifest: config
      };

    const savedSettings = await new ManifestService(projectId).updateConfigurationSettings(settings);

    setConfig(savedSettings.manifest);
  }

  async function toggleHandler(override: boolean): Promise<void> {
    console.log(`toggleHandler: Assigning toggle override flag to ${override} with useProject= ${useProject}`);
    setEditorOptions({
      selectOnLineNumbers: true,
      readOnly: ((!override && useProject) || (!useProject && !override))
    });

    setOverrideFlag(override);
  }

  useEffect(() => {
    (async function() {
      let projectId: string = null;

      if(useProject == true)
      {
        try{
        console.log('Retrieving project Id');
        
        const projectInfoService = await SDK.getService<IProjectPageService>(
          CommonServiceIds.ProjectPageService
        );
        const project = await projectInfoService.getProject();
        projectId = project.id;        
      } catch (error) {
        console.log('TEST: Failed to retrieve project Id');
        projectId = "000-000-000";
      }
      }
      
      const manifestService = new ManifestService(projectId);

      console.log('useEffect: loading initial settings.');
      //let manifest = await manifestService.getManifest();
      let settings: ICascadeSettings = await manifestService.getConfigurationSettings();
      let manifest: IManifest = null;

      if(settings != null)
      {
        manifest = settings.manifest;
        console.log(`Assigning overrideOrgSettings: ${settings.overrideOrgSettings}`);
        toggleValue.value = settings.overrideOrgSettings;
        setOverrideToggle(new ObservableValue<boolean>(settings.overrideOrgSettings));
      }

      if (manifest == null) {
        console.log('Assigning defaultManifest');
        manifest = Object.assign({}, ManifestService.defaultManifest);
      }

      saveDraft(JSON.stringify(manifest, null, 2));
    })();
  }, [saveDraft]);

  return [configText, toggleHandler, editorOptions, status, saveDraft, publishConfig];
}

export { useConfigurationStorage, IStatus };
