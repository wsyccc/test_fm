import { getCommonContext } from '@hulk/common';
import { GeoChartPropsInterface } from './type';

export const {
  Provider: GeoChartProvider,
  useCommon: useGeoChartCommon
} = getCommonContext<GeoChartPropsInterface>();
