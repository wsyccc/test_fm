import { React } from '@hulk/common';
import { useGeoChartCommon } from './context';
import { GeoChartPropsInterface } from "./type.ts";
import { ReactEcharts, Echarts } from '@hulk/common';
import { generateGeoChartOption, GeoChartCategory } from './utils.ts';


const GeoChart: React.FC = (props: GeoChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useGeoChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const [ready, setReady] = useState(false);
  const data = {
    width: 600,
    height: 400,
    bgColor: '#ffffff',
    category: GeoChartCategory.SVG,
    externalSourceLink: '/public/Geo/Veins_Medical_Diagram_clip_art.svg',
    ...props,
    ...widgetData,
  };

  const option = useMemo(() => {
    if (!ready) return undefined;
    return generateGeoChartOption(data);
  }, [data, ready]);
  
  useEffect(() => {
    if (data.externalSourceLink) fetch(data.externalSourceLink)
      .then(res => res.text())
      .then(svg => {
        Echarts.registerMap('diagram', { svg });
        setReady(true);
      });
  }, []);

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

export default GeoChart
