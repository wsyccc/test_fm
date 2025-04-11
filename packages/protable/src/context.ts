import { getCommonContext } from '@hulk/common';
import { ProtablePropsInterface } from './type';

export const {
  Provider: ProtableProvider,
  useCommon: useProtableCommon
} = getCommonContext<ProtablePropsInterface>();
