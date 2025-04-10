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
import { useLinechartCommon } from './context';
import { LinechartPropsInterface } from "./type.ts";
import { generateLineChartOption } from './utils.ts';
import { ReactEcharts } from '@hulk/common';
import defaultConfigs from './configs.ts';


const Linechart: React.FC = (props: LinechartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useLinechartCommon();

  const { useState, useRef, useEffect, useMemo } = React;
  const echartsRef = useRef<ReactEcharts>(null);

  const data: LinechartPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const option = useMemo(() => {
    return generateLineChartOption(data, { xData: data.xData ?? [], yData: data.yData ?? [] });
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

export default Linechart
