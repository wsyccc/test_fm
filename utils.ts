import type {Schema} from "ts-json-schema-generator/src/Schema/Schema";

export const exportSchemaFilter = (schema: Schema): Schema => {
  if (schema.definitions) {
    for (const k of Object.keys(schema.definitions)) {
      if (k.startsWith('Property.') || k.startsWith('DataType.')) {
        delete schema.definitions[k]
      }
    }
  }

  // delete schema.definitions?.StyleConfig;
  // delete schema.definitions?.Globals;
  // delete schema.additionalProperties;

  return schema;
}