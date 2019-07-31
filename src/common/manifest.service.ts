import { ConfigurationStorage, ConfigurationType } from './storage.service';
import { IManifest } from './types';

type Validator = (manifest: IManifest) => null | IManifestValidationError;

const ManifestMetadata = {
  availableVersions: [1],
};

enum ValidationErrorCode {
  InvalidVersion,
  InvalidCascade,
}

interface IManifestValidationError {
  code: number;
  description: string;
}

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
}

class ManifestValidationService {
  private manifest: IManifest;
  private validators: Validator[] = [this.checkVersion];

  public constructor(manifest: IManifest) {
    this.manifest = manifest;
  }

  public validate(): null | IManifestValidationError[] {
    const manifest = this.manifest;
    const errors: IManifestValidationError[] = [];

    for (let validator of this.validators) {
      const error = validator(manifest);
      error ? errors.push(error) : null;
    }

    if (errors.length > 0) {
      return errors;
    }
    return null;
  }

  private checkVersion(manifest: IManifest): null | IManifestValidationError {
    if (!ManifestMetadata.availableVersions.includes(Number(manifest.version))) {
      return {
        code: ValidationErrorCode.InvalidVersion,
        description: `Unknown version: ${manifest.version}`,
      };
    }
    return null;
  }
}

export { ManifestService, ManifestValidationService };
