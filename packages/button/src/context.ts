import { createCommonContext } from '@hulk/common';
import { ButtonPropsInterface } from './type';

export const {
  Provider: ButtonProvider,
  useCommon: useButtonCommon
} = createCommonContext<ButtonPropsInterface>();
