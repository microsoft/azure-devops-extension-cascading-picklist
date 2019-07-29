import { IManifest } from './types';
import {
  StorageService,
  ConfigurationType,
  ScopeType,
  ConfigurationStorage,
} from './storage.service';

class ManifestService {
  private configurationStorage: ConfigurationStorage;

  public constructor(projectId: string, workItemType: string) {
    this.configurationStorage = new ConfigurationStorage(
      ConfigurationType.Manifest,
      projectId,
      workItemType
    );
  }

  public async getManifest(): Promise<IManifest> {
    return this.configurationStorage.getConfiguration();
  }

  public async updateManifest(manifest: IManifest): Promise<IManifest> {
    return this.configurationStorage.setConfiguration(manifest);
  }
}

export { ManifestService };
