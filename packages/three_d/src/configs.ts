import { WidgetType } from "@hulk/common";
import { ThreeDPropsInterface } from "./type";

export default {
  type: WidgetType.three_d,
  width: 600,
  height: 480,
  externalSourceLink: '/public/3D/objExample2.obj',
  shallowTheme: true,
  wireframe: false,
  transparent: true,
  grid: true,
  ambientLight: 1.5,
  xScale: 1,
  yScale: 1,
  zScale: 1,
  alarms: [],
} as ThreeDPropsInterface