import { getCommonContext } from '@hulk/common';
import { TextPropsInterface } from './type';

export const {
  Provider: TextProvider,
  useCommon: useTextCommon
} = getCommonContext<TextPropsInterface>();
