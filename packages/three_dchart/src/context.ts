import { getCommonContext } from '@hulk/common';
import { ThreeDChartPropsInterface } from './type';

export const {
  Provider: ThreeDChartProvider,
  useCommon: useThreeDChartCommon
} = getCommonContext<ThreeDChartPropsInterface>();
