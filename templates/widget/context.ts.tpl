import { createCommonContext } from '@hulk/common';
import { {{namePascal}}PropsInterface } from './type';

export const {
  Provider: {{namePascal}}Provider,
  useCommon: use{{namePascal}}Common
} = createCommonContext<{{namePascal}}PropsInterface>();
