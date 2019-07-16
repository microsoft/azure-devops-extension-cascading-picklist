import * as SDK from 'azure-devops-extension-sdk';
import { IExtensionDataService, CommonServiceIds } from 'azure-devops-extension-api';
import { CascadeConfiguration } from './types';

enum ScopeType {
  Default = 'Default',
  User = 'User',
}

class CascadingConfigurationStorageService {
  private storageKey: string;
  private scopeType: ScopeType;

  private dataService: IExtensionDataService;

  public constructor(storageKey: string, scope: ScopeType) {
    this.storageKey = storageKey;
    this.scopeType = scope;
  }

  private async getDataService(): Promise<IExtensionDataService> {
    if (this.dataService === undefined) {
      this.dataService = await SDK.getService<IExtensionDataService>(
        CommonServiceIds.ExtensionDataService
      );
    }
    return this.dataService;
  }

  public async getCascadingConfiguration(): Promise<CascadeConfiguration> {
    const dataService = await this.getDataService();
    const dataManager = await dataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      await SDK.getAccessToken()
    );
    const cascadingConfiguration: CascadeConfiguration = await dataManager.getValue(
      this.storageKey,
      {
        scopeType: this.scopeType,
      }
    );

    return cascadingConfiguration;
  }

  public async writeCascadingConfiguration(
    cascade: CascadeConfiguration
  ): Promise<CascadeConfiguration> {
    const dataService = await this.getDataService();
    const dataManager = await dataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      await SDK.getAccessToken()
    );
    return dataManager.setValue(this.storageKey, cascade, {
      scopeType: this.scopeType,
    });
  }
}

export { ScopeType, CascadingConfigurationStorageService };
