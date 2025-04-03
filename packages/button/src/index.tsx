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
import {React} from '@hulk/common';
import { useButtonCommon } from './context';
import { ButtonPropsInterface } from "./type.ts";
import { Button as AntdButton } from '@hulk/common';
import { WidgetActions } from '@hulk/common';


const Button: React.FC = (props: ButtonPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useButtonCommon();

  const data: ButtonPropsInterface = {
    id: 'button',
    bgColor: '#000',
    text: 'Button',
    borderRadius: '4px',
    textColor: '#fff',
    textSize: '14px',
    textWeight: 'normal',
    width: 100,
    height: 40,
    ...props,
    ...widgetData,
  };

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;
  console.log(data.text)

  const onClick = () => {
    // trigger the action
    triggerAction([WidgetActions.onClick], isStorybook);
    // update the widget data
    updateWidgetData({ text: '123'}, isStorybook);
  }


  return <AntdButton
  onClick={onClick}>
    {data.text}
  </AntdButton>
}

export default Button
