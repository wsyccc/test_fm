import { OpenAI } from "@hulk/common";
export enum BarChartCategory {
  Basic = 'Basic',
  Vertical = 'Vertical',
  RadialPolar = 'Radial Polar',
  TangentialPolar = 'Tangential Polar',
  MixedLine = 'Mixed Line',
  Stacked = 'Stacked',
  StackedHorizontal = 'Stacked Horizontal',
}

export type BarChartRawDataType = {
  xData: string[];
  yData: {
    name: string;
    data: number[];
  }[];
};

const MixedLine = (configs: any, data: BarChartRawDataType) => {
  if (configs.category === BarChartCategory.MixedLine) {
    return data.yData.map((yD) => {
      return {
        animationDuration: 0,
        type: 'line',
        name: yD.name || '',
        data: yD.data,

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      };
    });
  }
  return [];
};

const BarChartTemplate = {
  xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  yData: [{
    name: 'amount',
    data: [120, 200, 150, 80, 70, 110, 130]
  }],
}

/**
 * 防抖函数: 多次调用时，只保留最后一次调用，延迟 delay 毫秒后执行
 */
function debounce<Func extends (...args: any[]) => Promise<any>>(fn: Func, delay: number): (...args: Parameters<Func>) => Promise<ReturnType<Func>> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingPromise: { resolve: Function; reject: Function } | null = null;
  return (...args: Parameters<Func>): Promise<ReturnType<Func>> => {
    if (timeout) {
      clearTimeout(timeout);
      // 如果存在挂起的 Promise，直接 reject 掉
      pendingPromise?.reject('Cancelled due to debounce');
    }
    return new Promise((resolve, reject) => {
      pendingPromise = { resolve, reject };
      timeout = setTimeout(async () => {
        timeout = null;
        pendingPromise = null;
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

export async function convertDBDataThroughOpenAI(rawData: any): Promise<any> {
  const prompt = `
请将以下原始数据转换为 ECharts 柱状图需要的 JSON 格式的xData和yData。
柱状图模板如下：
${JSON.stringify(BarChartTemplate, null, 2)}

原始数据如下：
${JSON.stringify(rawData, null, 2)}

转换规则：
1. xData 中的类别应根据原始数据中的时间字段生成；
2. yData中的数据项根据 value 字段生成，然后名字要做提取；
3. 如有缺失的类别，请补全为 0。
4. 由于柱状图显示有限数据，所以xData数据长度控制在20之内，yData数组顶多5到8个数据组

请返回符合模板的 JSON 格式数据。
`;

  // 创建 OpenAI API 配置
  const client = new OpenAI({
    apiKey: '',
    maxRetries: 0,
    dangerouslyAllowBrowser: true
  });

  // try {
  //   const response = await client.chat.completions.create({
  //     model: 'gpt-4',
  //     messages: [
  //       {
  //         role: 'user',
  //         content: prompt,
  //       },
  //     ],
  //     temperature: 0,
  //   });

  //   console.log(response)
  //   const resultText = response.data.choices[0].message?.content;
  //   if (!resultText) {
  //     throw new Error('OpenAI 返回内容为空');
  //   }
  //   // 解析返回的 JSON 数据
  //   const resultData = JSON.parse(resultText);
  //   return resultData;
  // } catch (error) {
  //   console.error("数据转换失败：", error);
  //   throw new Error("无法解析或获取 OpenAI 返回的数据");
  // }
}

export const debouncedConvertDBDataThroughOpenAI = debounce(convertDBDataThroughOpenAI, 500);

export function generateBarChartOption(configs: any, rawData: BarChartRawDataType) {
  let radialMax = 0;
  if (rawData.yData.length > 0) rawData.yData.map((yD) => {
    radialMax = Math.max(...yD.data, radialMax);
  });
  const legend = configs?.legendEnabled
    ? {
      orient: configs.legendLayout,
      textStyle: {
        color: configs.color,
      },
    }
    : null;
  const option =
    configs.category === BarChartCategory.RadialPolar
      ? {
        polar: {
          radius: [30, '90%'],
        },
        radiusAxis: {
          max: radialMax,
        },
        angleAxis: {
          type: 'category',
          startAngle: 75,
        },
        legend,
        series: [
          ...rawData.yData.map((yD) => {
            return {
              animationDuration: 0,
              type: 'bar',
              name: yD.name || '',
              data: yD.data,
              coordinateSystem: 'polar',

              label: {
                show: true,
                position: 'middle',
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            };
          }),
        ],
      }
      : configs.category === BarChartCategory.TangentialPolar
        ? {
          polar: {
            radius: [30, '90%'],
          },
          angleAxis: {
            max: radialMax,
            startAngle: 75,
          },
          radiusAxis: {
            type: 'category',
          },
          legend,
          series: [
            ...rawData.yData.map((yD) => {
              return {
                animationDuration: 0,
                type: 'bar',
                name: yD.name || '',
                data: yD.data,
                coordinateSystem: 'polar',

                label: {
                  show: true,
                  position: 'middle',
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              };
            }),
          ],
        }
        : {
          xAxis: {
            type: [BarChartCategory.Vertical, BarChartCategory.StackedHorizontal].includes(
              configs.category,
            )
              ? 'value'
              : 'category',
            data: rawData.xData,
          },
          yAxis: {
            type: [BarChartCategory.Vertical, BarChartCategory.StackedHorizontal].includes(
              configs.category,
            )
              ? 'category'
              : 'value',
            // 注意这里yAxis用xData的原因是eChart在把柱状图从水平变成垂直时，不会把x轴数据传递给y轴，导致y轴会显示默认的数字数组
            // 没必要做判断，因为echart渲染时会自动判断
            data: rawData.xData,
          },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          legend,
          series: [
            ...MixedLine(configs, rawData),
            ...(Array.isArray(rawData.yData)
              ? rawData.yData.map((yD) => {
                return {
                  animationDuration: 0,
                  type: 'bar',
                  name: yD.name || '',
                  data: yD.data,
                  stack: [BarChartCategory.Stacked, BarChartCategory.StackedHorizontal].includes(
                    configs.category,
                  )
                    ? 'Total'
                    : '',
                  label: {
                    show: configs.labelEnabled,
                    position: configs.labelPosition,
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                };
              }) : []),
          ],
        };

  return option;
}