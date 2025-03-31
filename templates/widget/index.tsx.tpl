import React from 'react'
import { use{{namePascal}}Common } from './context';
import { {{namePascal}}PropsInterface } from "./type.ts";
import { WidgetActions } from '@hulk/common';
// import must be import the specific component from the library
// DO NOT import the whole library

// YES: import AntdButton from 'antd/es/button'; or import { Button } from 'antd';
// NO: import antd;


const {{namePascal}}: React.FC = (props: {{namePascal}}PropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = use{{namePascal}}Common();
  const data = widgetData ?? props as {{namePascal}}PropsInterface;

  return <div>{{namePascal}}</div>
}

export default {{namePascal}}
