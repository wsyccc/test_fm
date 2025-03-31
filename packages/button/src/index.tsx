import { React } from '@hulk/common';
import { Button as AntdButton } from '@hulk/common';
import { useButtonCommon } from './context';
import {ButtonPropsInterface} from "./type.ts";
import { WidgetActions } from '@hulk/common';

const Button: React.FC = (props: ButtonPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useButtonCommon();
  // if widgetData is null, use props because it's from storybook
  const data = widgetData ?? props as ButtonPropsInterface;

  const isStorybook = props !== undefined && (props as ButtonPropsInterface).id !== undefined;

  const update = () => {
    console.log(isStorybook);
    if (data) updateWidgetData({ id: data?.id ? (Number(data.id) + 1).toString() : '1' }, isStorybook);
  };

  return (
    <>
      <span>{widgetData?.id ?? 0}</span>
      <AntdButton onClick={update}>+</AntdButton>
      <AntdButton onClick={resetWidgetData}>---</AntdButton>
      <AntdButton onClick={() => triggerAction([WidgetActions.onClick])}>....</AntdButton>
    </>
  );
};

export default Button;
