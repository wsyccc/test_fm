import {BaseWidgetDataType} from "@hulk/common";
import { GeoChartCategory } from "./utils";

export interface GeoChartPropsInterface extends BaseWidgetDataType{
  category?: GeoChartCategory;
  externalSourceLink?: string;
}

const GeoChartPropsSchema = {
  category: {
    type: "string",
    enum: ["SVG", "SVGScatter", "SVGLine", "SVGAnimation"], // 来自 GeoChartCategory
    required: false
  },
  externalSourceLink: {
    type: "string",
    required: false
  }
};

export default GeoChartPropsSchema;