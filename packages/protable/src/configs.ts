import { WidgetType } from "@hulk/common";
import { ProtablePropsInterface } from "./type";
import { ORIGINDATA } from "./constants";

export default {
  type: WidgetType.protable,
  width: 800,
  height: 650,
  originData: ORIGINDATA,
  pageSize: 10,
  columnSize: 5,
  currentPage: 1,
  fixedRowHeaders: 0,
  fixedColumnHeaders: true,
  pageBreak: true,
  tableName: '',
  keepColumnsTogether: true,
  keepRowsTogether: false,
  repeatRowHeaders: true,

  // add more default props here
} as ProtablePropsInterface