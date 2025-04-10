import { WidgetType } from "@hulk/common";
import { GeoChartPropsInterface } from "./type";
import { GeoChartCategory } from "./utils";

export default {
  type: WidgetType.geo_chart,
  width: 600,
  height: 400,
  bgColor: '#ffffff',
  category: GeoChartCategory.SVG,
  externalSourceLink: '/public/Geo/Veins_Medical_Diagram_clip_art.svg',
} as GeoChartPropsInterface