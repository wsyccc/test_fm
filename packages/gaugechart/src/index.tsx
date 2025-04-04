import { React } from '@hulk/common';
import { useGaugechartCommon } from './context';
import { GaugechartPropsInterface } from "./type.ts";
import { ReactEcharts } from '@hulk/common';
import { generateGaugeChartOption } from './utils.ts';


const Gaugechart: React.FC = (props: GaugechartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useGaugechartCommon();

  const { useRef, useEffect, useMemo } = React;

  const data: GaugechartPropsInterface = useMemo(() => {
    return {
      width: 400,
      height: 400,
      bgColor: '#ffffff',
      color: '#1890ff',
      axisColor: '#fff',
      progress: false,
      startAngle: 200,
      endAngle: -20,
      splitNumber: 10,
      labelDistance:-10,
      min: 0,
      max: 100,
      intervals: [],
      value: 50,
      fontSize: 15,
      prefix: '',
      suffix: '',
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const echartsRef = useRef<ReactEcharts>(null);

  const option = useMemo(() => {
    return generateGaugeChartOption(data);
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log('图表被点击了');
      // 这里可以添加你的点击处理逻辑
    };

    const echartsInstance = echartsRef.current?.getEchartsInstance();

    if (echartsInstance) {
      echartsInstance.on('mousedown', handleChartClick);
    }

    return () => {
      if (echartsInstance) {
        echartsInstance.off('mousedown', handleChartClick);
      }
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

export default Gaugechart
