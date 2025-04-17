import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PageRender } from './page_render';

const meta: Meta<typeof PageRender> = {
  title: 'Components/PageRender',
  component: PageRender,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <style>
          {`
                /* 隐藏 第二、第三 列（如果不需要隐藏，删掉下面这段即可） */
                .sbdocs .docblock-argstable thead th:nth-child(2),
                .sbdocs .docblock-argstable tbody td:nth-child(2) {
                  display: none !important;
                }
                .sbdocs .docblock-argstable thead th:nth-child(3),
                .sbdocs .docblock-argstable tbody td:nth-child(3) {
                  display: none !important;
                }
                /* 将 Control 列（第 4 列）宽度设为 450px */
                .sbdocs .docblock-argstable thead th:nth-child(4),
                .sbdocs .docblock-argstable tbody td:nth-child(4) {
                  width: 450px !important;
                }
              `}
        </style>
        <Story />
      </>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PageRender>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    yamlText: `header:
  title: "Report"
  subtitle: "Report builder Sample code"
  logo: "/"
  width: 600
  height: 100

footer:
  pageNo:
    visible: true
    align: "end"
  title: "Report Builder"
  subtitle: "Copyright by Cermate Software Inc."
  logo: ""
  width: 600
  height: 140

orientation: "horizontal"

pages:
  - content:
      - type: "vertical"
        gap: 10
        style:
          backgroundColor: "grey"
        content:
          - type: "horizontal"
            gap: 20
            style:
              align: "start"
            content:
              - type: "barchart"
                width: 180
                height: 200
              - type: "gaugechart"
                width: 180
                height: 400
              - type: "linechart"
                width: 180
                height: 200
          - type: "protable"
            width: 580
            height: 200
          - type: "vertical"
            style:
              align: "center"
            content:
              - type: "barchart"
                width: 400
                height: 200
              - type: "gaugechart"
                width: 300
                height: 200
              - type: "linechart"
                width: 580
                height: 200

  - width: 600
    height: 900
    content:
      - type: "horizontal"
        width: 600
        height: 700
        content:
          - type: "horizontal"
            width: 600
            height: 200
            content:
              - type: "barchart"
                width: 200
                height: 200
              - type: "gaugechart"
                width: 200
                height: 200
              - type: "linechart"
                width: 200
                height: 200
          - type: "protable"
            width: 600
            height: 200
          - type: "vertical"
            width: 600
            height: 200
            content:
              - type: "barchart"
                width: 600
                height: 200
              - type: "gaugechart"
                width: 600
                height: 200
              - type: "linechart"
                width: 600
                height: 200
`
  }
};
