import { getCommonContext } from '@hulk/common';
import { ThreeDPropsInterface } from './type';

export const {
  Provider: ThreeDProvider,
  useCommon: useThreeDCommon
} = getCommonContext<ThreeDPropsInterface>();
