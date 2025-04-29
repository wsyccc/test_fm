import { WidgetType } from "@hulk/common";
import { OtherChartsPropsInterface } from "./type";
import { OtherChartsCategory } from "./utils";

export default {
  type: WidgetType.other_charts,
  width: 600,
  height: 400,
  bgColor: "#ffffff",
  category: OtherChartsCategory.SimpleGraph,
  yData: [
    {
      name: "Node 1",
      x: 300,
      y: 300
    },
    {
      name: "Node 2",
      x: 800,
      y: 300
    },
    {
      name: "Node 3",
      x: 550,
      y: 100
    },
    {
      name: "Node 4",
      x: 550,
      y: 500
    }
  ],
} as OtherChartsPropsInterface