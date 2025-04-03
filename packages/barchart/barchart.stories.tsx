import { Meta, StoryObj } from '@storybook/react';
import Barchart from './src/index';
import { BarchartProvider } from "./src/context";
import { BarchartPropsInterface } from "./src/type";
import { BarChartCategory } from './src/utils';
import React from 'react';

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
    bgColor: 'white',
    // add more props here
    color: '#1890ff',
    category: BarChartCategory.Basic,
    legendEnabled: true,
    legendLayout: 'vertical',
    labelEnabled: true,
    labelPosition: 'top',
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: [{
      name: 'amount',
      data: [120, 200, 150, 80, 70, 110, 130]
    }],
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