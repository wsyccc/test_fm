import { React } from '@hulk/common';
import { useTreeMapChartCommon } from './context';
import { TreeMapChartPropsInterface } from "./type.ts";
import { ReactEcharts } from '@hulk/common';
import { generateBasicTreeMapChartOption, TreeMapChartCategory } from './utils.ts';

const TreeMapChart: React.FC = (props: TreeMapChartPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useTreeMapChartCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const echartsRef = useRef<ReactEcharts>(null);
  const data = {
    width: 600,
    height: 400,
    bgColor: '#ffffff',
    category: TreeMapChartCategory.Basic,
    yData: [
      {
        name: 'nodeA',
        value: 10,
        children: [
          {
            name: 'nodeAa',
            value: 4
          },
          {
            name: 'nodeAb',
            value: 6
          }
        ]
      },
      {
        name: 'nodeB',
        value: 20,
        children: [
          {
            name: 'nodeBa',
            value: 20,
            children: [
              {
                name: 'nodeBa1',
                value: 20
              }
            ]
          }
        ]
      }
    ],
    ...props,
    ...widgetData,
  };

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
