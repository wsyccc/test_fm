import { getCommonContext } from '@hulk/common';
import { OtherChartsPropsInterface } from './type';

export const {
  Provider: OtherChartsProvider,
  useCommon: useOtherChartsCommon
} = getCommonContext<OtherChartsPropsInterface>();
