import { getCommonContext } from '@hulk/common';
import { CandleStickChartPropsInterface } from './type';

export const {
  Provider: CandleStickChartProvider,
  useCommon: useCandleStickChartCommon
} = getCommonContext<CandleStickChartPropsInterface>();
