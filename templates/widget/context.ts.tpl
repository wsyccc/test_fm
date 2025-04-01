import { getCommonContext } from '@hulk/common';
import { {{namePascal}}PropsInterface } from './type';

export const {
  Provider: {{namePascal}}Provider,
  useCommon: use{{namePascal}}Common
} = getCommonContext<{{namePascal}}PropsInterface>();
