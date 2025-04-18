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
import { useImageCommon } from './context';
import { ImagePropsInterface } from "./type.ts";
import { WidgetActions } from '@hulk/common';
import defaultConfigs from './configs.ts';


const Image: React.FC = (props: ImagePropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useImageCommon();

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

  return <div>Image</div>
}

export default Image
