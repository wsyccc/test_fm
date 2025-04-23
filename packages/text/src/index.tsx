import { React } from '@hulk/common';
import { useTextCommon } from './context';
import { TextPropsInterface } from "./type.ts";
import defaultConfigs from './configs.ts';
import { textFormFormatter } from './utils.ts';


const Text: React.FC = (props: TextPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useTextCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: TextPropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const { width, height, isStorybook, ...rest } = data;
  const currentIsStorybook = isStorybook ?? false;
  const stylish = textFormFormatter(rest);
  
  return <div
    style={{
      ...stylish,
      // ...backgroundFormatter(defaultForm, publicResourceDir),
      backgroundColor: data.bgColor,
      width: data.width ?? '100%',
      height: data.height ?? '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      outline: 'none',
      borderRadius: 'inherit',
      display: 'flex',
      alignItems: data.alignItems,
      justifyContent: data.justifyContent,
    }}>{data.value}</div>

}

export default Text
