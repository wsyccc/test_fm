import { getCommonContext } from '@hulk/common';
import { GaugechartPropsInterface } from './type';

export const {
  Provider: GaugechartProvider,
  useCommon: useGaugechartCommon
} = getCommonContext<GaugechartPropsInterface>();
