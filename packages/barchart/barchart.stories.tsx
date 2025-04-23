import { Meta, StoryObj } from '@storybook/react';
import Barchart from './src/index';
import { BarchartProvider } from "./src/context";
import { BarchartPropsInterface } from "./src/type";
import { BarChartCategory } from './src/utils';
import React from 'react';
import { ORIGINDATA } from './src/constants';

const meta: Meta<typeof Barchart> = {
  title: 'Components/Barchart',
  component: Barchart,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [...Object.values(BarChartCategory).map((k) => {
        return k
      })]
    },
    legendLayout: {
      control: 'select',
      options: ['vertical', 'horizontal']
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'inside']
    },
    rawData:{
      description: '数据表读取到的数据'
    },
    xColumn: {
      description: '指定一个column的名字作为x轴数据，字符串，如果为空，会自动查找时间戳类型作为x轴，如果没有时间戳类型数据，会默认以获取到的第一个column'
    },
    yColumns: {
      description: '指定多个column的名字作为y轴数据，字符串数组，如果为空数组，会默认所有除x轴外的数据都作为y轴数据'
    },
  },
  decorators: [
    (Story) => (
      <BarchartProvider>
        <Story />
      </BarchartProvider>
    )
  ]
} satisfies Meta<typeof Barchart>;;

export default meta;

type Story = StoryObj<typeof Barchart>;

export const Default: Story = {
  args: {
    width: 800,
    height: 400,
    bgColor: 'white',
    // add more props here
    color: '#1890ff',
    category: BarChartCategory.Basic,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    rawData: ORIGINDATA,
    xColumn: 'Date_Time',
    yColumns: ['灌装4', '灌装5'],
  }
}

export const Weather: Story = {
  args: {
    category: BarChartCategory.MixedLine,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelPosition: 'inside',
    xData: ['03/24', '03/25', '03/26', '03/27', '03/28', '03/29', '03/30'],
    yData: [{
      name: 'Temperature',
      data: [8, 10, 7, 12, 5, 12, 6]
    }, {
      name: 'Rainfall',
      data: [120, 200, 150, 80, 70, 110, 130]
    }]
  },
};

export const Stack: Story = {
  args: {
    category: BarChartCategory.Stacked,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelPosition: 'inside',
    xData: ['03/24', '03/25', '03/26', '03/27', '03/28', '03/29', '03/30'],
    yData: [{
      name: 'Email',
      data: [8, 10, 7, 12, 5, 12, 6]
    }, {
      name: 'Ads',
      data: [120, 200, 150, 80, 70, 110, 130]
    }]
  },
};