import { React } from '@hulk/common';
import { useScatterChartCommon } from './context';
import { ScatterChartPropsInterface } from "./type.ts";
import { generateBasicScatterChartOption, generateCalendarScatterChartOption, generateDistributionScatterChartOption, generateLogarithmicScatterChartOption, generateSingleAxisScatterChartOption, ScatterChartCategory } from './utils.ts';
import { ReactEcharts, Echarts, EchartsStat } from '@hulk/common';

Echarts.registerTransform((EchartsStat as any).transform.clustering);
Echarts.registerTransform((EchartsStat as any).transform.regression);

const ScatterChart: React.FC = (props: ScatterChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useScatterChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;
  console.log(props, 'wid')
  const data: ScatterChartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      width: 600,
      height: 400,
      category: ScatterChartCategory.Basic,
      // @ts-ignore
      yData: (props?.category === ScatterChartCategory.Calendar || widgetData?.category === ScatterChartCategory.Calendar) ? undefined : [[10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81],
      [11.0, 8.33],
      [14.0, 7.66],
      [13.4, 6.81],
      [10.0, 6.33],
      [14.0, 8.96],
      [12.5, 6.82],
      [9.15, 7.2],
      [11.5, 7.2],
      [3.03, 4.23],
      [12.2, 7.83],
      [2.02, 4.47],
      [1.05, 3.33],
      [4.05, 4.96],
      [6.03, 7.24],
      [12.0, 6.26],
      [12.0, 8.84],
      [7.08, 5.82],
      [5.02, 5.68]],
      symbolSize: 20,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const echartsRef = useRef<ReactEcharts>(null);

  const [distributionType, setDistributionType] = useState<string>('scatter');

  const option = useMemo(() => {
    return data.category === ScatterChartCategory.Calendar ? generateCalendarScatterChartOption({
      ...data
    }) : data.category === ScatterChartCategory.Cluster ? generateBasicScatterChartOption({
      ...data,
    }) : data.category === ScatterChartCategory.DistibutionAndAggregate ? generateDistributionScatterChartOption({
      ...data,
      distributionType,
    }) : data.category === ScatterChartCategory.ExponentialRegression ? generateBasicScatterChartOption({
      ...data,
    }) : data.category === ScatterChartCategory.LogarithmicRegression ? generateLogarithmicScatterChartOption({
      ...data,
    }) : data.category === ScatterChartCategory.SingleAxis ? generateSingleAxisScatterChartOption({
      ...data,
    }) : generateBasicScatterChartOption({
      ...data,
    });
  }, [data, distributionType]);

  useEffect(() => {
    const echartsInstance = echartsRef.current?.getEchartsInstance();
    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

    if (!data.interval) return;

    const interval = setInterval(() => {
      if (!echartsInstance) return;
      setDistributionType(p => p === 'scatter' ? 'bar' : 'scatter');
    }, data.interval * 1000);

    return () => {
      clearInterval(interval); // ✅ 正确清除
    };
  }, [data.interval]);

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

export default ScatterChart
