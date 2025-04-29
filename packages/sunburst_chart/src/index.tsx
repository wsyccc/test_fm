import { React } from "@hulk/common";
import { useSunburstChartCommon } from "./context";
import { SunburstChartPropsInterface } from "./type.ts";
import { ReactEcharts } from "@hulk/common";
import { generateBasicSunburstChartOption } from "./utils.ts";
import defaultConfigs from "./configs.ts";


const SunburstChart: React.FC = (props: SunburstChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useSunburstChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data: SunburstChartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  const option = useMemo(() => {
    return generateBasicSunburstChartOption(data);
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log("图表被点击了");
      // 这里可以添加你的点击处理逻辑
    };

    const echartsInstance = echartsRef.current?.getEchartsInstance();

    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

    const onMouseOver = (event: any) => {
      echartsInstance.dispatchAction({
        type: "highlight",
        geoIndex: 0,
        name: event.name
      });
    };

    const onMouseOut = (event: any) => {
      echartsInstance.dispatchAction({
        type: "downplay",
        geoIndex: 0,
        name: event.name
      });
    };

    echartsInstance.on("mouseover", { seriesIndex: 0 }, onMouseOver);
    echartsInstance.on("mouseout", { seriesIndex: 0 }, onMouseOut);

    return () => {
      echartsInstance.off("mouseover", onMouseOver);
      echartsInstance.off("mouseout", onMouseOut);
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

export default SunburstChart
