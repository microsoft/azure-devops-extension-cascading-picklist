import { ConfigurationStorage, ConfigurationType } from './storage.service';
import { IManifest } from './types';

type Validator = (manifest: IManifest) => null | IManifestValidationError;

const ManifestMetadata = {
  availableVersions: [1],
};

enum ValidationErrorCode {
  SyntaxError,
  MissingRequiredProperty,
  InvalidVersion,
  InvalidCascadeType,
}

interface IManifestValidationError {
  code: ValidationErrorCode;
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

  public async createDefaultManifest(): Promise<IManifest> {
    return this.configurationStorage.setConfiguration({
      version: 1,
      cascades: {},
    });
  }
}

class ManifestValidationService {
  private dirtyManifest: Object;
  private manifest: IManifest;
  private validators: Validator[] = [this.checkVersion, this.checkCascadesType];
  private requiredProperties = ['version', 'cascades'];

  public constructor(manifest: Object) {
    this.dirtyManifest = manifest;
  }

  public ensureValidManifest(): IManifest {
    if (this.manifest == null) {
      throw new Error('Manifest is not valid');
    }
    return this.manifest;
  }

  public validate(): null | IManifestValidationError[] {
    const manifest = this.dirtyManifest;
    const errors: IManifestValidationError[] = [];

    const error = this.checkRequiredProperties(manifest, this.requiredProperties);
    if (error) {
      return [error];
    }

    for (let validator of this.validators) {
      const error = validator(manifest);
      error ? errors.push(error) : null;
    }

    if (errors.length > 0) {
      return errors;
    }

    this.manifest = this.dirtyManifest;
    return null;
  }

  private checkRequiredProperties(
    manifest: IManifest,
    requiredProperties: string[]
  ): null | IManifestValidationError {
    const missingProperties: string[] = [];
    for (let property of requiredProperties) {
      if (!manifest.hasOwnProperty(property)) {
        missingProperties.push(property);
      }
    }
    if (missingProperties.length > 0) {
      return {
        code: ValidationErrorCode.MissingRequiredProperty,
        description: `Property missing: ${missingProperties.join(', ')}`,
      };
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

  private checkCascadesType(manifest: IManifest): null | IManifestValidationError {
    if (typeof manifest.cascades !== 'object') {
      return {
        code: ValidationErrorCode.InvalidCascadeType,
        description: `"cascades" should be an object, not ${typeof manifest.cascades}`,
      };
    }
    if (Array.isArray(manifest.cascades)) {
      return {
        code: ValidationErrorCode.InvalidCascadeType,
        description: '"cascades" should be an object, not an array',
      };
    }
    return null;
  }
}

export { ManifestService, ManifestValidationService, IManifestValidationError };
