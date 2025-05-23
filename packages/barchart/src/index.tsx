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
import { convertOriginDataToRawData, React } from '@hulk/common';
import { useCommon } from './context';
import { BarchartPropsInterface } from "./type.ts";
import { BarChartCategory, generateBarChartOption } from './utils.ts';
import { ReactEcharts } from '@hulk/common';
import defaultConfigs from './configs.ts';


const Barchart: React.FC<BarchartPropsInterface> = (props) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useCommon();
  const { useMemo, useEffect, useRef } = React;

  const echartsRef = useRef<ReactEcharts>(null);

  const data: BarchartPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const option = useMemo(() => {
    const tableData = data.rawData ? convertOriginDataToRawData(data.rawData.rows, data.xColumn, data.yColumns) : undefined;
    
    return tableData !== undefined ? generateBarChartOption({ ...data, tableData }, { xData: tableData.xData ?? [], yData: tableData.yData ?? [] }) : generateBarChartOption(data, { xData: data.xData ?? [], yData: data.yData ?? [] });
  }, [data]);

  useEffect(() => {
    const handleChartClick = () => {
      console.log('图表被点击了');
      // updateWidgetData({
      //   color: "green",
      // }, isStorybook)
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
