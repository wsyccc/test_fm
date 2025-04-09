import { TreeMapChartPropsInterface } from "./type";
import { Echarts } from '@hulk/common';

const formatUtil = Echarts.format;

export enum TreeMapChartCategory {
  Basic = 'Basic',
  Complex = 'Complex'
}

export function generateBasicTreeMapChartOption({
  category, yData
}: {
} & TreeMapChartPropsInterface): echarts.EChartsOption {

  function getLevelOption() {
    return [
      {
        itemStyle: {
          borderWidth: 0,
          gapWidth: 5
        }
      },
      {
        itemStyle: {
          gapWidth: 1
        }
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          gapWidth: 1,
          borderColorSaturation: 0.6
        }
      }
    ];
  }

  return category === TreeMapChartCategory.Basic ? {
    series: [
      {
        type: 'treemap',
        data: yData
      }
    ]
  } : category === TreeMapChartCategory.Complex ? {
    title: {
      text: 'Disk Usage',
      left: 'center'
    },

    tooltip: {
      formatter: function (info: any) {
        var value = info.value;
        var treePathInfo = info.treePathInfo;
        var treePath = [];

        for (var i = 1; i < treePathInfo.length; i++) {
          // @ts-ignore
          treePath.push(treePathInfo[i].name);
        }

        return [
          '<div class="tooltip-title">' +
          formatUtil.encodeHTML(treePath.join('/')) +
          '</div>',
          'Disk Usage: ' + formatUtil.addCommas(value) + ' KB'
        ].join('');
      }
    },

    series: [
      {
        name: 'Disk Usage',
        type: 'treemap',
        visibleMin: 300,
        label: {
          show: true,
          formatter: '{b}'
        },
        itemStyle: {
          borderColor: '#fff'
        },
        levels: getLevelOption(),
        data: yData
      }
    ]
  } : {}
}