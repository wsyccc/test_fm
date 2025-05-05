import { WidgetType } from "@hulk/common";
import { ReportBuilderPropsInterface } from "./type";

export default {
  type: WidgetType.report_builder,
  yamlText: `header:
  title:
    type: text
    value: Header
    color: red
    fontSize: 32
    width: 100%
    height: 40
    border:
      style: dashed
      size: 2
      color: grey
  subtitle:
    type: text
    width: 100%
    height: 15
    value: Report builder Sample code
  logo:
    type: image
    src: "/public/Image/CE_Logo_Icon.png"
    width: 100%
    height: 120
footer:
  pageNo:
    visible: true
    align: end
  title:
    type: text
    value: Report Builder
    width: 100%
    height: 30
    color: pink
    fontSize: 24
    border:
      style: dashed
      size: 1
      color: pink
  subtitle:
    type: text
    width: 100%
    height: 15
    value: Copyright by @Cermate Software Inc.
  logo:
    type: image
    src: "/public/Image/CE_Logo_Web.png"
    width: 60
    height: 60
orientation: horizontal
pages:
- width: 100%
  height: auto
  content:
  - type: vertical
    gap: 10
    style:
      backgroundColor: grey
    content:
    - type: horizontal
      gap: 10
      style:
        align: start
        align-items: center
      content:
      - type: barchart
        width: 33%
        height: 200
        color: red
      - type: scatter_chart
        width: 33%
        height: 400
        bgColor: "#18ffd8"
      - type: linechart
        width: 33%
        height: 200
    - type: protable
      width: 580
      height: 200
    - type: vertical
      style:
        align: center
      content:
      - type: barchart
        width: 400
        height: 200
      - type: gaugechart
        width: 300
        height: 200
      - type: linechart
        width: 580
        height: 200
- content:
  - type: horizontal
    width: 1800
    height: 400
    style:
      align: start
    content:
    - type: horizontal
      width: 600
      height: 200
      content:
      - type: barchart
        width: 33%
        height: 200
        color: red
      - type: gaugechart
        width: 33%
        height: 400
        bgColor: "#18ffd8"
      - type: linechart
        width: 33%
        height: 200
    - type: protable
      width: 600
      height: 200
    - type: vertical
      width: 600
      height: 200
      content:
      - type: barchart
        width: 400
        height: 200
      - type: gaugechart
        width: 300
        height: 200
      - type: linechart
        width: 580
        height: 200`
  // add more default props here
} as ReportBuilderPropsInterface