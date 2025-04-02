/**
 * This is the entry point for the common package.
 * Add 3-rd party packages here.
 * **********************************************************************
 * ** 1. Use the specific import for 3-rd package you need.            **
 * **    YES: export {Button} from 'antd'; NO: export * from 'antd'    **
 * ** 2. For some packages, you need to all the exports from the lib
 * **    e.g. React and ReactDOM
 * **
 * **
 * **
 * **
 * ****************************************************************
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

export { React, _, ReactDOM };

export { createRoot } from 'react-dom/client';

export { getCommonContext } from './src/provider';
export type { CommonContextType } from './src/provider';

export type { BaseWidgetDataType, BaseWidgetActionType } from './type';

export { WidgetActions } from './constatns';

export { Button, Modal, message, Col, Collapse, Form, Input, InputNumber, Row, Slider, Spin, Switch, Tree } from 'antd';

export { default as dayjs } from 'dayjs';

