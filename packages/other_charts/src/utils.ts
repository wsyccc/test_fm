import { OtherChartsPropsInterface } from "./type";

export enum OtherChartsCategory {
  SimpleGraph = 'SimpleGraph',
  GraphOnCartesian = 'GraphOnCartesian',
  GraphOverlap = 'GraphOverlap',
  Tree = 'Tree',
  MultiTrees = 'MultiTrees',
  RadialTree = 'RadialTree',
  SimpleParallel = 'SimpleParallel',
  SimpleFunnel = 'SimpleFunnel',
  RichText = 'RichText',
}

export function generateOtherChartsOption({
  category, xData, yData,
}: {
} & OtherChartsPropsInterface): echarts.EChartsOption {
  let links: any[] = [];
  if (category === OtherChartsCategory.GraphOnCartesian) {
    links = yData.map(function (_item, i) {
      return {
        source: i,
        target: i + 1
      };
    });
    links.pop();
  } else if (category === OtherChartsCategory.SimpleGraph) {
    links = [
      {
        source: 0,
        target: 1,
        symbolSize: [5, 20],
        label: {
          show: true
        },
        lineStyle: {
          width: 5,
          curveness: 0.2
        }
      },
      {
        source: 'Node 2',
        target: 'Node 1',
        label: {
          show: true
        },
        lineStyle: {
          curveness: 0.2
        }
      },
      {
        source: 'Node 1',
        target: 'Node 3'
      },
      {
        source: 'Node 2',
        target: 'Node 3'
      },
      {
        source: 'Node 2',
        target: 'Node 4'
      },
      {
        source: 'Node 1',
        target: 'Node 4'
      }
    ]
  } else if (category === OtherChartsCategory.Tree) {
    yData.children.forEach(function (datum, index) {
      index % 2 === 0 && (datum.collapsed = true);
    });
  }

  return category === OtherChartsCategory.SimpleGraph ? {
    title: {
      text: 'Basic Graph'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 50,
        roam: true,
        label: {
          show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 20
        },
        data: yData,
        links,
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0
        }
      }
    ]
  } : category === OtherChartsCategory.GraphOnCartesian ? {
    title: {
      text: 'Graph on Cartesian'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        coordinateSystem: 'cartesian2d',
        symbolSize: 40,
        label: {
          show: true
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        data: yData,
        links,
        lineStyle: {
          color: '#2f4554'
        }
      }
    ]
  } : category === OtherChartsCategory.GraphOverlap ? {
    tooltip: {},
    legend: [
      {
        data: yData.categories.map(function (a) {
          return a.name;
        })
      }
    ],
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: yData.nodes,
        links: yData.links,
        categories: yData.categories,
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        labelLayout: {
          hideOverlap: true
        },
        scaleLimit: {
          min: 0.4,
          max: 2
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        }
      }
    ]
  } : category === OtherChartsCategory.Tree ? {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [yData],
        top: '1%',
        left: '7%',
        bottom: '1%',
        right: '20%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 9
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  } : category === OtherChartsCategory.MultiTrees ? {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    legend: {
      top: '2%',
      left: '3%',
      orient: 'vertical',
      data: [
        {
          name: 'tree1',
          icon: 'rectangle'
        },
        {
          name: 'tree2',
          icon: 'rectangle'
        }
      ],
      borderColor: '#c23531'
    },
    series: [
      {
        type: 'tree',
        name: 'tree1',
        data: [yData[0]],
        top: '5%',
        left: '7%',
        bottom: '2%',
        right: '60%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      },
      {
        type: 'tree',
        name: 'tree2',
        data: [yData[1]],
        top: '20%',
        left: '60%',
        bottom: '22%',
        right: '18%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        expandAndCollapse: true,
        emphasis: {
          focus: 'descendant'
        },
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  } : category === OtherChartsCategory.RadialTree ? {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [yData],
        top: '18%',
        bottom: '14%',
        layout: 'radial',
        symbol: 'emptyCircle',
        symbolSize: 7,
        initialTreeDepth: 3,
        animationDurationUpdate: 750,
        emphasis: {
          focus: 'descendant'
        }
      }
    ]
  } : category === OtherChartsCategory.SimpleParallel ? {
    parallelAxis: [
      { dim: 0, name: 'Price' },
      { dim: 1, name: 'Net Weight' },
      { dim: 2, name: 'Amount' },
      {
        dim: 3,
        name: 'Score',
        type: 'category',
        data: ['Excellent', 'Good', 'OK', 'Bad']
      }
    ],
    series: {
      type: 'parallel',
      lineStyle: {
        width: 4
      },
      data: yData
    }
  } : category === OtherChartsCategory.SimpleFunnel ? {
    title: {
      text: 'Funnel'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: xData
    },
    series: [
      {
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: yData
      }
    ]
  } : category === OtherChartsCategory.RichText ? {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      data: xData
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          position: 'inner',
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        data: yData[0]
      },
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '60%'],
        labelLine: {
          length: 30
        },
        label: {
          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: yData[1]
      }
    ]
  } : {};
}