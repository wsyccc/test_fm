import { getCommonContext } from '@hulk/common';
import { ButtonPropsInterface } from './type';

export const {
  Provider: ButtonProvider,
  useCommon: useButtonCommon
} = getCommonContext<ButtonPropsInterface>();
