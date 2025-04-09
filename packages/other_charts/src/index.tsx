import { React } from '@hulk/common';
import { useOtherChartsCommon } from './context';
import { OtherChartsPropsInterface } from "./type.ts";
import { ReactEcharts, Echarts, EchartsStat } from '@hulk/common';
import { generateOtherChartsOption, OtherChartsCategory } from './utils.ts';


const OtherCharts: React.FC = (props: OtherChartsPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useOtherChartsCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data = {
    width: 600,
    height: 400,
    bgColor: '#ffffff',
    category: OtherChartsCategory.SimpleGraph,
    yData: [
      {
        name: 'Node 1',
        x: 300,
        y: 300
      },
      {
        name: 'Node 2',
        x: 800,
        y: 300
      },
      {
        name: 'Node 3',
        x: 550,
        y: 100
      },
      {
        name: 'Node 4',
        x: 550,
        y: 500
      }
    ],
    ...props,
    ...widgetData,
  };

  const option = useMemo(() => {
    return generateOtherChartsOption(data);
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log('图表被点击了');
      // 这里可以添加你的点击处理逻辑
    };

    const echartsInstance = echartsRef.current?.getEchartsInstance();

    if (!echartsInstance || echartsInstance.isDisposed?.()) return;


    return () => {

    };
  }, []);

  return (
    <ReactEcharts
      ref={echartsRef}
      option={{
        ...option,
        backgroundColor: data.bgColor
      }}
      style={{ width: data.width, height: data.height }}
      notMerge={true}
    />
  )
}

export default OtherCharts
