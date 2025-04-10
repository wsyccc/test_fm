import { React } from '@hulk/common';
import { useOtherChartsCommon } from './context';
import { OtherChartsPropsInterface } from "./type.ts";
import { ReactEcharts } from '@hulk/common';
import { generateOtherChartsOption } from './utils.ts';
import defaultConfigs from './configs.ts';


const OtherCharts: React.FC = (props: OtherChartsPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useOtherChartsCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data: OtherChartsPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

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
