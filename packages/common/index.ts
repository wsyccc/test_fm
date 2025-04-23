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

export { default as dayjs } from 'dayjs';

export { createRoot } from 'react-dom/client';

/**
 * ==================Custom====================
 */
export { getCommonContext } from './src/provider';
export type { CommonContextType } from './src/provider';
export type { BaseWidgetDataType, BaseWidgetActionType, StyleConfig } from './type';
export { BaseTriggerActions, WidgetType } from './constants';
export { convertOriginDataToRawData, toPascalCase } from './utils';
export {YamlParser} from './src/yaml_parser/YamlParser';
/**
 * ==================END Custom=================
 */


/**
 * ==================Antd====================
 */
export { Button, Modal, message, Col, Collapse, Form, Input, InputNumber, Row, Slider, Spin, Switch, Tree, Splitter, Flex, Typography } from 'antd';
export { ProTable } from "@ant-design/pro-components";
export type { ActionType, ProColumns } from "@ant-design/pro-components";
/**
 * ============================================
 */


/**
 * ==================Echarts====================
 */
import * as Echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import * as EchartsStat from 'echarts-stat';
import 'echarts-gl';
export { EchartsStat, ReactEcharts, Echarts };
/**
 * ============================================
 */


/**
 * ==================Three.js===================
 */
export { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
export { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
export {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
export type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
export { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
export { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
export { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
export { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
/**
 * ============================================
 */

