/**
 * Have to use 3rd-party lib from @hulk/common
 *
 * @description
 * 1. use the script
 * ```sh
 * yarn install:lib <lib_name>
 * ```
 * The script will install the lib to @hulk/common
 *
 * 2. add the lib export in @hulk/common/index.ts, remember to use the specific import for 3-rd package you need.
 * ```ts
 * export { Button } from 'antd';
 * ```
 * 3. add the lib import in the component
 * ```ts
 * import { Button } from '@hulk/common';
 * ```
 */
import { React } from '@hulk/common';
import { useBarchartCommon } from './context';
import { BarchartPropsInterface } from "./type.ts";
import { BarChartCategory, generateBarChartOption } from './utils.ts';
import { ReactEcharts } from '@hulk/common';


const Barchart: React.FC = (props: BarchartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useBarchartCommon();

  const { useMemo, useEffect, useRef } = React;

  const echartsRef = useRef<ReactEcharts>(null);

  const data = {
    width: 600,
    height: 400,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: BarChartCategory.Basic,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [{
      name: 'amount',
      data: [120, 200, 150, 80, 70, 110, 130]
    }],
    ...props,
    ...widgetData,
  };

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const option = useMemo(() => {
    return generateBarChartOption(data, { xData: data.xData, yData: data.yData });
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log('图表被点击了');
      // 这里可以添加你的点击处理逻辑
    };

    const echartsInstance = echartsRef.current?.getEchartsInstance();
    
    if (!echartsInstance || echartsInstance.isDisposed?.()) return;

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

export default Barchart
