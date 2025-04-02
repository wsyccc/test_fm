import type {BaseWidgetActionType, BaseWidgetDataType} from "@hulk/common";
import {WidgetActions} from '@hulk/common';

export interface ButtonPropsInterface extends BaseWidgetDataType{
  id: string;
  bgColor?: string;
  // add more props here
  text?: string;
  borderRadius?: string;
  textColor?: string;
  textSize?: string;
  textWeight?: string;
}

export const Actions: Record<string, BaseWidgetActionType> = {
  onClick: {
    type: WidgetActions.onClick,
    description: 'button clicked',
    payload: {}
  }
}