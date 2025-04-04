import { getCommonContext } from '@hulk/common';
import { SplitterPropsInterface } from './type';

export const {
  Provider: SplitterProvider,
  useCommon: useSplitterCommon
} = getCommonContext<SplitterPropsInterface>();
