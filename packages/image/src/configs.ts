import { WidgetType } from "@hulk/common";
import { ImagePropsInterface } from "./type";

export default {
  type: WidgetType.image,
  width: 120,
  height: 120,
  // add more default props here
  src: "/public/Image/CE_Logo_Icon.png",
  alt: "test purpose only"

} as ImagePropsInterface