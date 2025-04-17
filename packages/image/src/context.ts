import { getCommonContext } from '@hulk/common';
import { ImagePropsInterface } from './type';

export const {
  Provider: ImageProvider,
  useCommon: useImageCommon
} = getCommonContext<ImagePropsInterface>();
