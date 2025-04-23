import { Meta, StoryObj } from '@storybook/react';
import Linechart from './src/index';
import { LinechartProvider } from "./src/context";
import { LinechartPropsInterface } from "./src/type";
import React from 'react';
import { LineChartCategory } from './src/utils';
import { ORIGINDATA } from './src/constants';

const meta: Meta<typeof Linechart> = {
  title: 'Components/Linechart',
  component: Linechart,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [...Object.values(LineChartCategory).map((k) => {
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
    rawData: {
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
      <LinechartProvider>
        <Story />
      </LinechartProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Linechart>;

export const Default: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 400,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.Basic,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    rawData: ORIGINDATA,
    xColumn: '',
    yColumns: ['灌装1', '灌装2','灌装3'],

  }
};

export const Smoothed: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.Smoothed,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [{
      name: 'Rainfall',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }],
  }
};

export const Area: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.Area,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [{
      name: 'Rainfall',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }],
  }
};

export const StackedLine: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.StackedLine,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [
      {
        name: 'Email',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      },
    ],
  }
};

export const StackedArea: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.StackedArea,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [
      {
        name: 'Email',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      },
    ],
  }
};

export const Race: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.Race,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelEnabled: true,
    labelPosition: 'top',
    xData: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    yData: [
      {
        name: 'Email',
        data: Array.from({ length: 30 }, (_, i) => 100 + Math.floor(Math.random() * 150) + i * 30),
      },
      {
        name: 'Search Engine',
        data: Array.from({ length: 30 }, (_, i) => 800 + Math.floor(Math.random() * 200 + i * 10)),
      },
      {
        name: 'Direct',
        data: Array.from({ length: 30 }, (_, i) => 300 + Math.floor(Math.random() * 100) + i * 50),
      },
    ],
  }
};

export const Step: Story = {
  args: {
    isStorybook: true,
    bgColor: '#ffffff',
    color: '#1890ff',
    category: LineChartCategory.Step,
    legendEnabled: true,
    legendLayout: 'horizontal',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [
      {
        name: 'Email',
        data: [120, 232, 101, 234, 90, 230, 10],
        step: 'start',
      },
      {
        name: 'Search Engine',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        step: 'end',
      },
      {
        name: 'Direct',
        data: [320, 432, 301, 434, 390, 530, 320],
        step: 'middle',
      },

    ],
  }
};