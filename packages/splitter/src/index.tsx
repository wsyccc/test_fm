import { Button, React } from '@hulk/common';
import { useSplitterCommon } from './context';
import { SplitterPropsInterface } from "./type.ts";
import { Flex, Splitter as AntdSplitter, Typography } from '@hulk/common';
import defaultConfigs from './configs.ts';

const Desc: React.FC<Readonly<{ text?: string | number, parentStylish?: {}, childStylish?: {} }>> = (props) => (
  <Flex justify="center" align="center" style={{ height: '100%', ...props.parentStylish }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: 'nowrap', margin: 0, ...props.childStylish }}>
      {props.text}
    </Typography.Title>
  </Flex>
);

const Splitter: React.FC = (props: SplitterPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useSplitterCommon();

  const { useMemo } = React;

  const data: SplitterPropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const isPanelProp = (obj: any) =>
    typeof obj === "object" && obj !== null && !("title" in obj);

  const normalizeDirection = (dir: string | undefined): "horizontal" | "vertical" =>
    dir === "vertical" ? "vertical" : "horizontal";

  // 渲染函数
  function renderSplitter(
    tempData: any[],
    direction: string = "",
    isRoot = true
  ) {
    const currentDirection = normalizeDirection(direction);
    const nextDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";

    const splitterProps = {
      layout: currentDirection,
      ...(isRoot ? {
        style: {
          width: data.width,
          height: data.height,
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: data.bgColor ?? ''
        }
      } : {}),
    };

    return (
      <AntdSplitter {...splitterProps}>
        {tempData.map((item, index) => {
          if (Array.isArray(item)) {
            let panelProps: Record<string, any> = {};
            let children = item;

            if (item.length > 0 && isPanelProp(item[0])) {
              panelProps = item[0];
              children = item.slice(1);
            }

            return (
              <AntdSplitter.Panel key={index} {...panelProps}>
                {renderSplitter(children, nextDirection, false)}
              </AntdSplitter.Panel>
            );
          } else if (typeof item === "object" && item.title) {
            return (
              <AntdSplitter.Panel key={index} {...item}>
                {item.title === 'Left' ? <>
                  <Button type='primary' style={{ width: "100%", height: "100%" }}>{item.title}</Button>
                </> : <Desc
                  text={item.title}
                  // 把item.style应用到包裹着label的dom里面
                  parentStylish={item.style}
                  // 把item.stylish应用到label自身的dom
                  childStylish={item.stylish}
                />}
              </AntdSplitter.Panel>
            );
          } else {
            return null;
          }
        })}
      </AntdSplitter>
    );
  }

  return <div>{renderSplitter(data.layout, data.direction)}</div>
}

export default Splitter
