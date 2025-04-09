import { React } from '@hulk/common';
import { useThreeDChartCommon } from './context';
import { ThreeDChartPropsInterface } from "./type.ts";
import { ReactEcharts, Echarts, EchartsStat } from '@hulk/common';
import { generateBasicChartOption, ThreeDChartCategory } from './utils.ts';


const ThreeDChart: React.FC = (props: ThreeDChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useThreeDChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: ThreeDChartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      width: 600,
      height: 400,
      category: ThreeDChartCategory.Bar,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const echartsRef = useRef<ReactEcharts>(null);

  const option = useMemo(() => {
    return generateBasicChartOption({
      ...data
    });
  }, [data]);

  useEffect(() => {
    const echartsInstance = echartsRef.current?.getEchartsInstance();
    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

    return () => { };
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

export default ThreeDChart
