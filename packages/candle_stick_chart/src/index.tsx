import { React } from '@hulk/common';
import { useCandleStickChartCommon } from './context';
import { CandleStickChartPropsInterface } from "./type.ts";
import { ReactEcharts, Echarts } from '@hulk/common';
import { CandleStickChartCategory, generateBasicCandleStickChartOption } from './utils.ts';
import defaultConfigs from './configs.ts';



const CandleStickChart: React.FC = (props: CandleStickChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useCandleStickChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data: CandleStickChartPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const option = useMemo(() => {
    return generateBasicCandleStickChartOption(data);
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log('图表被点击了');
      // 这里可以添加你的点击处理逻辑
    };

    const echartsInstance = echartsRef.current?.getEchartsInstance();

    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

    const onMouseOver = (event: any) => {
      echartsInstance.dispatchAction({
        type: 'highlight',
        geoIndex: 0,
        name: event.name
      });
    };

    const onMouseOut = (event: any) => {
      echartsInstance.dispatchAction({
        type: 'downplay',
        geoIndex: 0,
        name: event.name
      });
    };

    echartsInstance.on('mouseover', { seriesIndex: 0 }, onMouseOver);
    echartsInstance.on('mouseout', { seriesIndex: 0 }, onMouseOut);

    return () => {
      echartsInstance.off('mouseover', onMouseOver);
      echartsInstance.off('mouseout', onMouseOut);
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

export default CandleStickChart
