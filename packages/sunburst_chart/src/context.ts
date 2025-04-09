import { getCommonContext } from '@hulk/common';
import { SunburstChartPropsInterface } from './type';

export const {
  Provider: SunburstChartProvider,
  useCommon: useSunburstChartCommon
} = getCommonContext<SunburstChartPropsInterface>();
