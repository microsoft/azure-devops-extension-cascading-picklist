import { ConfigurationStorage, ConfigurationType } from './storage.service';
import { IManifest } from './types';

class ManifestService {
  private configurationStorage: ConfigurationStorage;

  public constructor(projectId: string) {
    this.configurationStorage = new ConfigurationStorage(ConfigurationType.Manifest, projectId);
  }

  public async getManifest(): Promise<IManifest> {
    return this.configurationStorage.getConfiguration();
  }

  public async updateManifest(manifest: IManifest): Promise<IManifest> {
    return this.configurationStorage.setConfiguration(manifest);
  }

  public async createDefaultManifest(): Promise<IManifest> {
    return this.configurationStorage.setConfiguration({
      version: 1,
      cascades: {},
    });
  }
}

export { ManifestService };
