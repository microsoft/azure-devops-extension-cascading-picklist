import { CommonServiceIds, IExtensionDataService } from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';
import { CascadeConfiguration } from './types';

enum ScopeType {
  Default = 'Default',
  User = 'User',
}

enum ConfigurationType {
  Manifest = 'manifest',
}

class StorageService {
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

  public async getData(): Promise<Object> {
    const dataService = await this.getDataService();
    const dataManager = await dataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      await SDK.getAccessToken()
    );
    return dataManager.getValue(this.storageKey, {
      scopeType: this.scopeType,
    });
  }

  public async setData(data: Object): Promise<Object> {
    const dataService = await this.getDataService();
    const dataManager = await dataService.getExtensionDataManager(
      SDK.getExtensionContext().id,
      await SDK.getAccessToken()
    );
    return dataManager.setValue(this.storageKey, data, {
      scopeType: this.scopeType,
    });
  }
}

class ConfigurationStorage {
  private storageService: StorageService;

  public constructor(
    configurationType: ConfigurationType,
    projectId: string,
    workItemType: string
  ) {
    if (workItemType === '' || workItemType === undefined) {
      throw new Error('Work item type cannot be empty or undefined.');
    }
    this.storageService = new StorageService(
      `${configurationType}|${projectId}|${workItemType}`,
      ScopeType.Default
    );
  }

  public async getConfiguration(): Promise<CascadeConfiguration> {
    return this.storageService.getData() as Promise<CascadeConfiguration>;
  }

  public async setConfiguration(
    configuration: CascadeConfiguration
  ): Promise<CascadeConfiguration> {
    return this.storageService.setData(configuration) as Promise<CascadeConfiguration>;
  }
}

export { ScopeType, StorageService, ConfigurationStorage, ConfigurationType };
