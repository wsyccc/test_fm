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
import { useButtonCommon } from './context';
import { ButtonPropsInterface } from "./type.ts";
import defaultConfigs from './configs.ts';


const Button: React.FC<ButtonPropsInterface> = (props) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useButtonCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: ButtonPropsInterface = useMemo(() => {
      return {
        //TODO add default props here above ...props
        ...defaultConfigs,
        ...props,
        ...widgetData,
      };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  return <div>Button</div>
}

export default Button
