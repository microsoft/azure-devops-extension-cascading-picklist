import {
  IWorkItemFormService,
  IWorkItemNotificationListener,
  IWorkItemFieldChangedArgs,
  WorkItemTrackingServiceIds,
} from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices';
import * as SDK from 'azure-devops-extension-sdk';
import { CascadingFieldsService } from '../common/cascading.service';
import { CascadingConfigurationStorageService, ScopeType } from '../common/storage.service';

SDK.init({
  applyTheme: true,
  loaded: false,
}).then(
  async (): Promise<void> => {
    const workItemFormService = await SDK.getService<IWorkItemFormService>(
      WorkItemTrackingServiceIds.WorkItemFormService
    );

    const cascadeConfigurationService = new CascadingConfigurationStorageService(
      'configuration',
      ScopeType.Default
    );
    const cascade = await cascadeConfigurationService.getCascadingConfiguration();

    const cascadingService = new CascadingFieldsService(workItemFormService, cascade);

    const provider: IWorkItemNotificationListener = {
      onLoaded: async () => await cascadingService.cascadeAll(),
      onSaved: async () => await cascadingService.cascadeAll(),
      onRefreshed: async () => await cascadingService.cascadeAll(),
      onReset: async () => await cascadingService.cascadeAll(),
      onUnloaded: async () => await cascadingService.resetAllCascades(),
      onFieldChanged: async (fieldChangedArgs: IWorkItemFieldChangedArgs) => {
        await cascadingService.performCascading(Object.keys(fieldChangedArgs.changedFields)[0]);
      },
    };

    SDK.register<IWorkItemNotificationListener>(SDK.getContributionId(), provider);
    SDK.notifyLoadSucceeded();
  }
);
