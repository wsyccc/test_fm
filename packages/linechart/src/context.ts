import { getCommonContext } from '@hulk/common';
import { LinechartPropsInterface } from './type';

export const {
  Provider: LinechartProvider,
  useCommon: useLinechartCommon
} = getCommonContext<LinechartPropsInterface>();
