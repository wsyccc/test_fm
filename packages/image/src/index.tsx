import { React } from "@hulk/common";
import { useImageCommon } from "./context";
import { ImagePropsInterface } from "./type.ts";
import defaultConfigs from "./configs.ts";


const Image: React.FC = (props: ImagePropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useImageCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: ImagePropsInterface = useMemo(() => {
    return {
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  return <img
    src={data.src ?? ""}
    alt={data.alt ?? ""}
    style={{
      backgroundColor: data.bgColor,
      width: data.width ?? "100%",
      height: data.height ?? "100%",

    }} />
}

export default Image
