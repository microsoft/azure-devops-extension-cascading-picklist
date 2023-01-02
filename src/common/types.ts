export type FieldName = string;
export type FieldOptions = Record<FieldName, string | string[] | FieldOptionsFlags>;

// export type AuxCondition = Record<FieldName, string>;
// export type FieldProperties = Record<FieldName, (AuxCondition | FieldOptions)[]>;
export type FieldProperties = Record<FieldName, FieldOptions[]>;
export type FieldContainer = Record<FieldName, FieldProperties[]>;

export type CascadeConfiguration = Record<FieldName, Record<FieldName, FieldContainer>>;
export type CascadeMap = Record<FieldName, ICascade>;

export enum FieldOptionsFlags {
  All = 'all',
}
export interface ICascade {
  alters: FieldName[];
  cascades: Record<FieldName, FieldContainer>;
}

export interface IManifest {
  version?: string;
  cascades?: CascadeConfiguration;
}

