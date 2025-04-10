import { React } from '@hulk/common';
import { useTreeMapChartCommon } from './context';
import { TreeMapChartPropsInterface } from "./type.ts";
import { ReactEcharts } from '@hulk/common';
import { generateBasicTreeMapChartOption } from './utils.ts';
import defaultConfigs from './configs.ts';

const TreeMapChart: React.FC = (props: TreeMapChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useTreeMapChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data: TreeMapChartPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const option = useMemo(() => {
    return generateBasicTreeMapChartOption(data);
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
  );
}

export default TreeMapChart;
