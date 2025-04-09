import { getCommonContext } from '@hulk/common';
import { ScatterChartPropsInterface } from './type';

export const {
  Provider: ScatterChartProvider,
  useCommon: useScatterChartCommon
} = getCommonContext<ScatterChartPropsInterface>();
