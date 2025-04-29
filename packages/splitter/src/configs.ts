import { WidgetType } from "@hulk/common";
import { SplitterPropsInterface } from "./type";

export default {
  type: WidgetType.splitter,
  width: 300,
  height: 100,
  direction: "",
  layout: [
    { title: "left" },
    { title: "right" },
  ],
} as SplitterPropsInterface