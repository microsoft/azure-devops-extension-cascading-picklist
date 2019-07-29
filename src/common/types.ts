export type FieldName = string;
export type FieldOptions = Record<FieldName, string[] | FieldOptionsFlags>;
export type CascadeConfiguration = Record<FieldName, Record<FieldName, FieldOptions>>;
export type CascadeMap = Record<FieldName, ICascade>;

export enum FieldOptionsFlags {
  All = 'all',
}
export interface ICascade {
  alters: FieldName[];
  cascades: Record<FieldName, FieldOptions>;
}

export interface IManifest {
  version?: string;
  cascades?: CascadeConfiguration;
}
