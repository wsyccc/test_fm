import { React } from '@hulk/common';
import { useDynamicBarchartCommon } from './context';
import { DynamicBarchartPropsInterface } from "./type.ts";
import { DynamicBarChartCategory, generateAnimationBarChartOption, generateDynamicBarChartOption, generateFinanceBarChartOption, generateLargeScaleBarChartOption, generateRaceBarChartOption } from './utils.ts';
import { ReactEcharts } from '@hulk/common';

interface DataItem {
  value: number;
  groupId: string;
}

const DynamicBarchart: React.FC = (props: DynamicBarchartPropsInterface | {}) => {
  const { widgetData } = useDynamicBarchartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: DynamicBarchartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      width: 600,
      height: 400,
      category: DynamicBarChartCategory.Dynamic,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const echartsRef = useRef<ReactEcharts>(null);

  // DynamicBarChartCategory.Race数据
  const [raceData, setRaceData] = useState(() => {
    const res: number[] = []
    for (let i = 0; i < 5; ++i) {
      res.push(Math.round(Math.random() * 200));
    }
    return res;
  })

  // DynamicBarChartCategory.Dynamic数据
  const [categories, setCategories] = useState(() => {
    const now = new Date();
    const res: string[] = [];
    for (let i = 0; i < 10; i++) {
      res.unshift(new Date(+now - i * 2000).toLocaleTimeString().replace(/^\D*/, ''));
    }
    return res;
  });

  const [categories2, setCategories2] = useState(() => Array.from({ length: 10 }, (_, i) => i));
  const [barData, setBarData] = useState(() => Array.from({ length: 10 }, () => Math.round(Math.random() * 1000)));
  const [lineData, setLineData] = useState(() => Array.from({ length: 10 }, () => +(Math.random() * 10 + 5).toFixed(1)));
  const countRef = useRef(11);

  // DynamicBarChartCategory.Animation数据
  const animationXData: string[] = [];
  const animationData1: number[] = [];
  const animationData2: number[] = [];
  for (var i = 0; i < 100; i++) {
    animationXData.push('A' + i);
    animationData1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    animationData2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
  }

  // DynamicBarChartCategory.Drilldown数据
  const drilldownData = [
    {
      dataGroupId: 'animals',
      data: [
        ['Cats', 4],
        ['Dogs', 2],
        ['Cows', 1],
        ['Sheep', 2],
        ['Pigs', 1]
      ]
    },
    {
      dataGroupId: 'fruits',
      data: [
        ['Apples', 4],
        ['Oranges', 2]
      ]
    },
    {
      dataGroupId: 'cars',
      data: [
        ['Toyota', 4],
        ['Opel', 2],
        ['Volkswagen', 2]
      ]
    }
  ];

  const option = useMemo(() => {
    return data.category === DynamicBarChartCategory.Dynamic ? generateDynamicBarChartOption({
      ...data,
      categories,
      categories2,
      barData,
      lineData
    }) : data.category === DynamicBarChartCategory.Animation ? generateAnimationBarChartOption({ ...data, animationXData, animationData1, animationData2 }) : data.category === DynamicBarChartCategory.Drilldown ? {
      xAxis: { data: ['Animals', 'Fruits', 'Cars'] },
      yAxis: {},
      dataGroupId: '',
      animationDurationUpdate: 500,
      series: {
        type: 'bar',
        id: 'sales',
        data: [
          { value: 5, groupId: 'animals' },
          { value: 2, groupId: 'fruits' },
          { value: 4, groupId: 'cars' }
        ] as DataItem[],
        universalTransition: { enabled: true, divideShape: 'clone' }
      }
      } : data.category === DynamicBarChartCategory.LargeScale ? generateLargeScaleBarChartOption({ ...data }) : data.category === DynamicBarChartCategory.Finance ? generateFinanceBarChartOption({ ...data }) : generateRaceBarChartOption({ ...data, raceData });
  }, [data, categories, categories2, barData, lineData, raceData]);

  useEffect(() => {
    const echartsInstance = echartsRef.current?.getEchartsInstance();

    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

    const handleChartClick = (event: any) => {
      if (data.category === DynamicBarChartCategory.Drilldown && echartsInstance) {
        const dataItem = event.data as DataItem;
        if (!dataItem || !dataItem.groupId) return;

        const subData = drilldownData.find(d => d.dataGroupId === dataItem.groupId);
        if (!subData) return;

        const newOption: echarts.EChartsOption = {
          xAxis: {
            data: subData.data.map(item => item[0])
          },
          series: {
            type: 'bar',
            id: 'sales',
            dataGroupId: subData.dataGroupId,
            data: subData.data.map(item => item[1]),
            universalTransition: {
              enabled: true,
              divideShape: 'clone'
            }
          },
          graphic: [
            {
              type: 'text',
              left: 50,
              top: 20,
              style: {
                text: 'Back',
                fontSize: 18
              },
              onclick: () => {
                echartsInstance.setOption(option);
              }
            }
          ]
        };

        echartsInstance.setOption(newOption);
      } else {
        console.log('点击了图表')
      };
    }


    if (echartsInstance) {
      echartsInstance.on('mousedown', handleChartClick);
    }

    const interval = setInterval(() => {
      if (data.category === DynamicBarChartCategory.Dynamic) {
        const newTime = new Date().toLocaleTimeString().replace(/^\D*/, '');
        const newBar = Math.round(Math.random() * 1000);
        const newLine = +(Math.random() * 10 + 5).toFixed(1);

        // 更新数据
        setCategories(prev => [...prev.slice(1), newTime]);
        setCategories2(prev => [...prev.slice(1), countRef.current++]);
        setBarData(prev => [...prev.slice(1), newBar]);
        setLineData(prev => [...prev.slice(1), newLine]);

        if (echartsInstance) {
          echartsInstance.setOption({
            xAxis: [
              { data: [...categories.slice(1), newTime] },
              { data: [...categories2.slice(1), countRef.current - 1] },
            ],
            series: [
              { data: [...barData.slice(1), newBar] },
              { data: [...lineData.slice(1), newLine] }
            ]
          });
        }
      } else if (data.category === DynamicBarChartCategory.Race) {
        const tempData = [...raceData];
        for (var i = 0; i < raceData.length; ++i) {
          if (Math.random() > 0.9) {
            tempData[i] += Math.round(Math.random() * 2000);

          } else {
            tempData[i] += Math.round(Math.random() * 200);
          }
        }

        setRaceData(tempData);
        if (echartsInstance) {
          echartsInstance.setOption({
            series: [
              { data: tempData }
            ]
          });
        }
      }
    }, 2500);

    return () => {
      if (echartsInstance) {
        echartsInstance.off('mousedown', handleChartClick);
      }
      () => clearInterval(interval);
    };
  }, []);

  return <ReactEcharts
    ref={echartsRef}
    option={{
      ...option,
      backgroundColor: data.bgColor
    }}
    style={{ width: data.width, height: data.height }}
    notMerge={true}
  />
}

export default DynamicBarchart
