import { getCommonContext } from '@hulk/common';
import { TreeMapChartPropsInterface } from './type';

export const {
  Provider: TreeMapChartProvider,
  useCommon: useTreeMapChartCommon
} = getCommonContext<TreeMapChartPropsInterface>();
