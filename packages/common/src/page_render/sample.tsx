import React from 'react';
import { StackType } from '../../type';
import { WidgetType } from '../../constants';
import { Page } from '../layout_render/YamlRenderer';

export const SAMPLE_PAGES = [
  {
    name:'page_1',
    width: 600,
    height: 800,
    header: {
      title: "page 1",
      logo: <img src="" alt="logo" />,
      width: 600,
      height: 100,
    },
    footer: {
      pageNo: {
        visible: true,
        align: 'right'
      },
      title: '',
      logo: '',
      width: 600,
      height: 100,
    },
    verticalStack: {
      width: 600,
      height: 600,
      content: [
        {
          type: StackType.horizontal,
          content: [
            {
              type: WidgetType.barchart,
              width: 200,
              height: 200
            },
            {
              type: WidgetType.gaugechart,
              width: 200,
              height: 200
            },
            {
              type: WidgetType.linechart,
              width: 200,
              height: 200
            },
          ],
          width: 600,
          height: 200
        },
        {
          type: WidgetType.protable,
          width: 600,
          height: 200
        },
        {
          type: StackType.vertical,
          content: [
            {
              type: WidgetType.barchart,
              width: 600,
              height: 200
            },
            {
              type: WidgetType.gaugechart,
              width: 600,
              height: 200
            },
            {
              type: WidgetType.linechart,
              width: 600,
              height: 200
            },
          ],
          width: 600,
          height: 200
        },
      ]
    }
  },
  {
    name: 'page_2',
    width: 600,
    height: 800,
    footer: {
      pageNo: {
        visible: true,
        align: 'right'
      },
      width: 600,
      height: 100,
    },
    horizontalStack: {
      width: 600,
      height: 700,
      content: [
        {
          type: StackType.horizontal,
          content: [
            {
              type: WidgetType.barchart,
              width: 200,
              height: 200
            },
            {
              type: WidgetType.gaugechart,
              width: 200,
              height: 200
            },
            {
              type: WidgetType.linechart,
              width: 200,
              height: 200
            },
          ],
          width: 600,
          height: 200
        },
        {
          type: WidgetType.protable,
          width: 600,
          height: 200
        },
        {
          type: StackType.vertical,
          content: [
            {
              type: WidgetType.barchart,
              width: 600,
              height: 200
            },
            {
              type: WidgetType.gaugechart,
              width: 600,
              height: 200
            },
            {
              type: WidgetType.linechart,
              width: 600,
              height: 200
            },
          ],
          width: 600,
          height: 200
        },
      ]
    }
  }
 ] as Page[]