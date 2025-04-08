import { getCommonContext } from '@hulk/common';
import { DynamicBarchartPropsInterface } from './type';

export const {
  Provider: DynamicBarchartProvider,
  useCommon: useDynamicBarchartCommon
} = getCommonContext<DynamicBarchartPropsInterface>();
