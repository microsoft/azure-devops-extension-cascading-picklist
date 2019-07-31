import { CommonServiceIds, IExtensionDataService } from 'azure-devops-extension-api';
import * as SDK from 'azure-devops-extension-sdk';

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

  public constructor(configurationType: ConfigurationType, projectId: string) {
    this.storageService = new StorageService(
      `${configurationType}|${projectId}`,
      ScopeType.Default
    );
  }

  public async getConfiguration(): Promise<Object> {
    return this.storageService.getData();
  }

  public async setConfiguration(configuration: Object): Promise<Object> {
    return this.storageService.setData(configuration) as Promise<Object>;
  }
}

export { ScopeType, StorageService, ConfigurationStorage, ConfigurationType };
