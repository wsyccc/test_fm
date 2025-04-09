import { SunburstChartPropsInterface } from "./type";

export enum SunburstChartCategory {
  Basic = 'Basic',
  Rounded = 'Rounded',
  LabelRotate = 'LabelRotate',
  Monochrome = 'Monochrome',
  Detail = 'Detail',
  Advance = 'Advance',
}

export function generateBasicSunburstChartOption({
  category, yData
}: {
} & SunburstChartPropsInterface): echarts.EChartsOption {
  const colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
  const bgColor = '#2E2733';
  const itemStyle = {
    star5: {
      color: colors[0]
    },
    star4: {
      color: colors[1]
    },
    star3: {
      color: colors[2]
    },
    star2: {
      color: colors[3]
    }
  };
  if (category === SunburstChartCategory.Advance && yData && yData.length) {
    for (let j = 0; j < yData.length; ++j) {
      let level1 = yData[j].children;
      if (level1)
        for (let i = 0; i < level1.length; ++i) {
          let block = level1[i].children;
          let bookScore = [];
          let bookScoreId;
          if (block) for (let star = 0; star < block.length; ++star) {
            let style: { color: string; opacity?: number } = (function (name) {
              switch (name) {
                case '5☆':
                  bookScoreId = 0;
                  return itemStyle.star5;
                case '4☆':
                  bookScoreId = 1;
                  return itemStyle.star4;
                case '3☆':
                  bookScoreId = 2;
                  return itemStyle.star3;
                case '2☆':
                  bookScoreId = 3;
                  return itemStyle.star2;
                default:
                  return itemStyle.star2;

              }
            })(block[star].name);
            block[star].label = {
              color: style.color,
              downplay: {
                opacity: 0.5
              }
            };
            if (block[star].children) {
              style = {
                opacity: 1,
                color: style.color
              };
              block[star].children?.forEach(function (book) {
                book.value = 1;
                book.itemStyle = style;
                book.label = {
                  color: style.color
                };
                let value = 1;
                if (bookScoreId === 0 || bookScoreId === 3) {
                  value = 5;
                }
                if (bookScore[bookScoreId]) {
                  // @ts-ignore
                  bookScore[bookScoreId].value += value;
                } else {
                  // @ts-ignore
                  bookScore[bookScoreId] = {
                    color: colors[bookScoreId],
                    value: value
                  };
                }
              });
            }
          }
          level1[i].itemStyle = {
            color: yData[j].itemStyle?.color
          };
        }
    }
  }
  return category === SunburstChartCategory.Basic ? {
    series: {
      type: 'sunburst',
      // emphasis: {
      //     focus: 'ancestor'
      // },
      // @ts-ignore
      data: yData ?? [],
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      }
    }
  } : category === SunburstChartCategory.Rounded ? {
    series: {
      type: 'sunburst',
      // @ts-ignore
      data: yData,
      radius: [60, '90%'],
      itemStyle: {
        borderRadius: 7,
        borderWidth: 2
      },
      label: {
        rotate: 'radial'
      }
    }
  } : category === SunburstChartCategory.LabelRotate ? {
    silent: true,
    // @ts-ignore
    series: [
      {
        radius: ['15%', '90%'],
        type: 'sunburst',
        sort: undefined,
        emphasis: {
          focus: 'ancestor'
        },
        data: yData,
        label: {
          color: '#000',
          textBorderColor: '#fff',
          textBorderWidth: 2,
          formatter: function (param) {
            var depth = param.treePathInfo.length;
            if (depth === 2) {
              return 'radial';
            } else if (depth === 3) {
              return 'tangential';
            } else if (depth === 4) {
              return '0';
            }
            return '';
          }
        },
        levels: [
          {},
          {
            itemStyle: {
              color: '#CD4949'
            },
            label: {
              rotate: 'radial'
            }
          },
          {
            itemStyle: {
              color: '#F47251'
            },
            label: {
              rotate: 'tangential'
            }
          },
          {
            itemStyle: {
              color: '#FFC75F'
            },
            label: {
              rotate: 0
            }
          }
        ]
      }
    ]
  } : category === SunburstChartCategory.Detail ? {
    title: {
      text: 'WORLD COFFEE RESEARCH SENSORY LEXICON',

      textStyle: {
        fontSize: 14,
        align: 'center'
      },
      subtextStyle: {
        align: 'center'
      },
    },
    series: {
      type: 'sunburst',
      // @ts-ignore
      data: yData,
      radius: [0, '95%'],
      sort: undefined,
      emphasis: {
        focus: 'ancestor'
      },
      levels: [
        {},
        {
          r0: '15%',
          r: '35%',
          itemStyle: {
            borderWidth: 2
          },
          label: {
            rotate: 'tangential'
          }
        },
        {
          r0: '35%',
          r: '70%',
          label: {
            align: 'right'
          }
        },
        {
          r0: '70%',
          r: '72%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false
          },
          itemStyle: {
            borderWidth: 3
          }
        }
      ]
    }
  } : category == SunburstChartCategory.Monochrome ? {
    series: {
      radius: ['15%', '80%'],
      type: 'sunburst',
      sort: undefined,
      emphasis: {
        focus: 'ancestor'
      },
      // @ts-ignore
      data: yData,
      label: {
        rotate: 'radial'
      },
      levels: [],
      itemStyle: {
        color: '#ddd',
        borderWidth: 2
      }
    }
  } : category === SunburstChartCategory.Advance ? {
    backgroundColor: bgColor,
    color: colors,
    // @ts-ignore
    series: [
      {
        type: 'sunburst',
        center: ['50%', '48%'],
        data: yData,
        sort: function (a, b) {
          if (a.depth === 1) {
            return b.getValue() - a.getValue();
          } else {
            return a.dataIndex - b.dataIndex;
          }
        },
        label: {
          rotate: 'radial',
          color: bgColor
        },
        itemStyle: {
          borderColor: bgColor,
          borderWidth: 2
        },
        levels: [
          {},
          {
            r0: 0,
            r: 40,
            label: {
              rotate: 0
            }
          },
          {
            r0: 40,
            r: 105
          },
          {
            r0: 115,
            r: 140,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: colors[2],
              color: 'transparent'
            },
            label: {
              rotate: 'tangential',
              fontSize: 10,
              color: colors[0]
            }
          },
          {
            r0: 140,
            r: 145,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: colors[0]
            },
            label: {
              position: 'outside',
              textShadowBlur: 5,
              textShadowColor: '#333'
            },
            downplay: {
              label: {
                opacity: 0.5
              }
            }
          }
        ]
      }
    ]
  } : {
  };
}
