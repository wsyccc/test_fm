import React from 'react';
import { StackType } from '../../type';
import { WidgetType } from '../../constants';
import { Page, Report } from '../yaml_parser/YamlParser';

export const SAMPLE_REPORT = {
  header: {
    title: "Report",
    logo: "/",
    width: 600,
    height: 100,
  },
  footer: {
    pageNo: {
      visible: true,
      align: 'end'
    },
    title: '',
    logo: '',
    width: 600,
    height: 100,
  },
  orientation: 'horizontal',
  pages: [
    {
      width: 600,
      height: 800,
      content: [
        {
          type: StackType.vertical,
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
      ]
    },
    {
      width: 600,
      height: 800,
      content: [{
        type: StackType.horizontal,
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
      }]
    }
  ] as Page[]
} as Report