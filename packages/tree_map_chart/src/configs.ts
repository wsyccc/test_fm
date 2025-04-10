import { WidgetType } from "@hulk/common";
import { TreeMapChartPropsInterface } from "./type";
import { TreeMapChartCategory } from "./utils";

export default {
  type: WidgetType.tree_map_chart,
  width: 600,
  height: 400,
  bgColor: '#ffffff',
  category: TreeMapChartCategory.Basic,
  yData: [
    {
      name: 'nodeA',
      value: 10,
      children: [
        {
          name: 'nodeAa',
          value: 4
        },
        {
          name: 'nodeAb',
          value: 6
        }
      ]
    },
    {
      name: 'nodeB',
      value: 20,
      children: [
        {
          name: 'nodeBa',
          value: 20,
          children: [
            {
              name: 'nodeBa1',
              value: 20
            }
          ]
        }
      ]
    }
  ],
} as TreeMapChartPropsInterface