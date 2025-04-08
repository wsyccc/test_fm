import { getCommonContext } from '@hulk/common';
import { SpeedThreeDPropsInterface } from './type';

export const {
  Provider: SpeedThreeDProvider,
  useCommon: useSpeedThreeDCommon
} = getCommonContext<SpeedThreeDPropsInterface>();
