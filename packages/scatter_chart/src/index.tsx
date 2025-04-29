import { React } from "@hulk/common";
import { useScatterChartCommon } from "./context";
import { ScatterChartPropsInterface } from "./type.ts";
import { generateBasicScatterChartOption, generateCalendarScatterChartOption, generateDistributionScatterChartOption, generateLogarithmicScatterChartOption, generateSingleAxisScatterChartOption, ScatterChartCategory } from "./utils.ts";
import { ReactEcharts, Echarts, EchartsStat } from "@hulk/common";
import defaultConfigs from "./configs.ts";

Echarts.registerTransform((EchartsStat as any).transform.clustering);
Echarts.registerTransform((EchartsStat as any).transform.regression);

const ScatterChart: React.FC = (props: ScatterChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useScatterChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;
  console.log(props, "wid")
  const data: ScatterChartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      // @ts-ignore
      yData: (props?.category === ScatterChartCategory.Calendar || widgetData?.category === ScatterChartCategory.Calendar) ? undefined : defaultConfigs.yData,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const echartsRef = useRef<ReactEcharts>(null);

  const [distributionType, setDistributionType] = useState<string>("scatter");

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
      setDistributionType(p => p === "scatter" ? "bar" : "scatter");
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
