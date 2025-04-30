import {BaseWidgetDataType, WidgetType, StyleConfig } from "@hulk/common";

export interface ReportBuilderPropsInterface extends BaseWidgetDataType {
  // add more props here
  yamlText?: string;
  jsonData?: string;
}

export enum StackType {
  vertical = "vertical",
  horizontal = "horizontal"
}

export type CardConfig = WidgetCard | StackCard;

export interface StackCard {
  type: StackType;
  // 如果type是StackType.widget的话，content应该没有东西，
  content?: StackCard[];
  // 如果type不是StackType.widget的话，说明还是layout，还没到widget，所以configs应该是undefined
  // configs?: BaseWidgetDataType;
  width?: string | number;
  height?: string | number;
  // style是这个layout或者widget的背景图片、背景颜色等等
  style?: StyleConfig;
  // 内容里面stackCard之间的间距
  gap?: number
}

export interface WidgetCard {
  type: WidgetType;
  configs?: BaseWidgetDataType;
}


export interface Page {
  // 宽高设置了会有问题，TODO
  width?: string | number;
  height?: string | number;
  // 要注意page里面content的StackCard长度应该为1，且类型大概率为StackType，如果类型不为StackType，那表示整个page只有一个Widget
  content?: CardConfig[];
}

// interface Text extends TextPropsInterface {
//   type: WidgetType.text;
// }

// interface Image extends ImagePropsInterface {
//   type: WidgetType.image;
// }

export interface Report extends Record<string, any> {
  header?: {
    title?: WidgetCard;
    subtitle?: WidgetCard;
    logo?: WidgetCard;
    width?: string | number;
    height?: string | number;
  },
  footer?: {
    pageNo: {
      visible: boolean;
      align?: "start" | "end" | "center"
    },
    title?: WidgetCard;
    subtitle?: WidgetCard;
    logo?: WidgetCard;
    width?: string | number;
    height?: string | number;
  },
  orientation: "horizontal" | "vertical",
  pages: Page[]
}