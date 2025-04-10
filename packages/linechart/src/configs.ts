import { WidgetType } from "@hulk/common";
import { LinechartPropsInterface } from "./type";
import { LineChartCategory } from "./utils";

export default {
  type: WidgetType.splitter,
  width: 600,
  height: 400,
  bgColor: '#ffffff',
  color: '#1890ff',
  category: LineChartCategory.Basic,
  legendEnabled: true,
  legendLayout: 'vertical',
  labelEnabled: true,
  labelPosition: 'top',
  xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  yData: [{
    name: 'Rainfall',
    data: [820, 932, 901, 934, 1290, 1330, 1320]
  }],
} as LinechartPropsInterface