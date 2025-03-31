import {BaseWidgetDataType, WidgetActions} from "@hulk/common";

export interface ButtonPropsInterface extends BaseWidgetDataType{
  id: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  text?: string;
  actions: WidgetActions[];
}