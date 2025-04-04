import { BaseWidgetDataType } from "@hulk/common";

interface PanelConfig {
  title?: string;
  collapsible?: boolean;
  resizable?: boolean;
  defaultSize?: number | string;
  min?: number | string;
  max?: number | string;
  style?: {};
  stylish?: {}
}

type NestedLayout = (PanelConfig | NestedLayout)[];

export interface SplitterPropsInterface extends BaseWidgetDataType {
  direction: '' | 'vertical',
  layout: NestedLayout
}