import { getCommonContext } from '@hulk/common';
import { BarchartPropsInterface } from './type';

export const {
  Provider: BarchartProvider,
  useCommon
} = getCommonContext<BarchartPropsInterface>();
