import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
} from 'azure-devops-extension-api/Common';
import { WorkItemField } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTracking';
import { WorkItemTrackingRestClient } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingClient';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices';
import * as SDK from 'azure-devops-extension-sdk';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import {
  CascadeConfiguration,
  CascadeMap,
  FieldOptions,
  FieldOptionsFlags,
  ICascade,
} from './types';

type InvalidField = string;

class CascadingFieldsService {
  private workItemService: IWorkItemFormService;
  private cascadeMap: CascadeMap;

  public constructor(
    workItemService: IWorkItemFormService,
    cascadeConfiguration: CascadeConfiguration
  ) {
    this.workItemService = workItemService;
    this.cascadeMap = this.createCascadingMap(cascadeConfiguration);
  }

  private createCascadingMap(cascadeConfiguration: CascadeConfiguration): CascadeMap {
    const cascadeMap: CascadeMap = {};
    if (typeof cascadeConfiguration === 'undefined') {
      return cascadeMap;
    }

    Object.entries(cascadeConfiguration).map(([fieldName, fieldValues]) => {
      let alters: string[] = [];
      Object.values(fieldValues).map(cascadeDefinitions => {
        Object.keys(cascadeDefinitions).map(field => alters.push(field));
      });

      alters = uniq(alters);

      const cascade: ICascade = {
        alters,
        cascades: fieldValues,
      };

      cascadeMap[fieldName] = cascade;
    });
    return cascadeMap;
  }

  private getAffectedFields(fieldReferenceName: string, fieldValue: string): string[] {
    if (!this.cascadeMap[fieldReferenceName].cascades.hasOwnProperty(fieldValue)) {
      return [];
    }
    return Object.keys(this.cascadeMap[fieldReferenceName].cascades[fieldValue]);
  }

  private async validateFilterOrClean(fieldReferenceName: string): Promise<boolean> {
    const allowedValues: string[] = await (this
      .workItemService as any).getFilteredAllowedFieldValues(fieldReferenceName);
    const fieldValue = (await this.workItemService.getFieldValue(fieldReferenceName)) as string;
    if (!allowedValues.includes(fieldValue)) {
      return this.workItemService.setFieldValue(fieldReferenceName, '');
    }
  }

  public async resetAllCascades(): Promise<void[]> {
    const fields = flatten(Object.values(this.cascadeMap).map(value => value.alters));
    const fieldsToReset = new Set<string>(fields);
    return Promise.all(
      Array.from(fieldsToReset).map(async fieldName => {
        const values = await this.workItemService.getAllowedFieldValues(fieldName);
        await (this.workItemService as any).filterAllowedFieldValues(fieldName, values);
      })
    );
  }

  private async prepareCascadeOptions(affectedFields: string[]): Promise<FieldOptions> {
    const fieldValues: FieldOptions = {};

    await Promise.all(
      flatten(
        affectedFields.map(field => {
          return Object.entries(this.cascadeMap).map(async ([alterField, cascade]) => {
            if (cascade.alters.includes(field)) {
              const fieldValue = (await this.workItemService.getFieldValue(alterField)) as string;
              let cascadeOptions: string[];
              if (
                typeof cascade.cascades[fieldValue][field] === 'string' &&
                cascade.cascades[fieldValue][field] === FieldOptionsFlags.All
              ) {
                cascadeOptions = (await this.workItemService.getAllowedFieldValues(field)).map(
                  value => value.toString()
                );
              } else {
                cascadeOptions = cascade.cascades[fieldValue][field] as string[];
              }
              if (fieldValues.hasOwnProperty(field)) {
                fieldValues[field] = intersection(fieldValues[field], cascadeOptions);
              } else {
                fieldValues[field] = cascadeOptions;
              }
            }
          });
        })
      )
    );
    return fieldValues;
  }

  public async cascadeAll(): Promise<void[][]> {
    return Promise.all(
      Object.keys(this.cascadeMap).map(async field => this.performCascading(field))
    );
  }

  public async performCascading(changedFieldReferenceName: string): Promise<void[]> {
    const changedFieldValue = (await this.workItemService.getFieldValue(
      changedFieldReferenceName
    )) as string;
    if (!this.cascadeMap.hasOwnProperty(changedFieldReferenceName)) {
      return;
    }

    const affectedFields = this.getAffectedFields(changedFieldReferenceName, changedFieldValue);
    const fieldValues = await this.prepareCascadeOptions(affectedFields);

    Object.entries(fieldValues).map(async ([fieldName, fieldValues]) => {
      await (this.workItemService as any).filterAllowedFieldValues(fieldName, fieldValues);
      await this.validateFilterOrClean(fieldName);
    });
  }
}

interface ICascadeValidatorError {
  description: string;
}

class CascadeValidationService {
  private cachedFields: WorkItemField[];

  public async validateCascades(cascades: CascadeConfiguration): Promise<null | InvalidField[]> {
    const projectInfoService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectInfoService.getProject();

    if (this.cachedFields == null) {
      const witRestClient = await getClient(WorkItemTrackingRestClient);
      const fields = await witRestClient.getFields(project.id);
      this.cachedFields = fields;
    }
    const fieldList = this.cachedFields.map(field => field.referenceName);

    // Check fields correctness for config root
    let invalidFieldsTotal = Object.keys(cascades).filter(field => !fieldList.includes(field));

    // Check fields on the lower level of config
    Object.values(cascades).map(fieldValues => {
      Object.values(fieldValues).map(innerFields => {
        const invalidFields = Object.keys(innerFields).filter(field => !fieldList.includes(field));
        invalidFieldsTotal = [...invalidFieldsTotal, ...invalidFields];
      });
    });

    if (invalidFieldsTotal.length > 0) {
      return invalidFieldsTotal;
    }

    return null;
  }
}

export { CascadingFieldsService, CascadeValidationService, ICascadeValidatorError };
