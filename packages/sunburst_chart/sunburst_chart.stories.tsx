import { Meta, StoryObj } from '@storybook/react';
import SunburstChart from './src/index';
import { SunburstChartProvider } from "./src/context";
import { SunburstChartPropsInterface } from "./src/type";
import React from 'react';
import { SunburstChartCategory } from './src/utils';
import { RAWDATA, DETAIL_DATA, MONOCHROME_DATA, ADVANCE_DATA } from './src/constants';

const meta: Meta<typeof SunburstChart> = {
  title: 'Components/SunburstChart',
  component: SunburstChart,
  tags: ['autodocs'],
  // argTypes:{
  //   category:{
  //     table:{
  //       disable:true
  //     }
  //   }
  // },
  argTypes: {
    category: {
      control: 'select',
      options: [...Object.values(SunburstChartCategory).map((k) => {
        return k
      })]
    }
  },
  decorators: [
    (Story) => (
      <SunburstChartProvider>
        <Story />
      </SunburstChartProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SunburstChart>;

export const Default: Story = {
  args: {
    isStorybook: true,
    width: 400,
    height: 400,
    category: SunburstChartCategory.Basic,
    yData: RAWDATA
  } as SunburstChartPropsInterface
};

export const Rounded: Story = {
  args: {
    isStorybook: true,
    width: 400,
    height: 400,
    category: SunburstChartCategory.Rounded,
    yData: RAWDATA
  } as SunburstChartPropsInterface
};

export const LabelRotate: Story = {
  args: {
    isStorybook: true,
    width: 400,
    height: 400,
    category: SunburstChartCategory.LabelRotate,
    yData: [
      {
        value: 8,
        children: [
          {
            value: 4,
            children: [
              {
                value: 2
              },
              {
                value: 1
              },
              {
                value: 1
              },
              {
                value: 0.5
              }
            ]
          },
          {
            value: 2
          }
        ]
      },
      {
        value: 4,
        children: [
          {
            children: [
              {
                value: 2
              }
            ]
          }
        ]
      },
      {
        value: 4,
        children: [
          {
            children: [
              {
                value: 2
              }
            ]
          }
        ]
      },
      {
        value: 3,
        children: [
          {
            children: [
              {
                value: 1
              }
            ]
          }
        ]
      }
    ],
  } as SunburstChartPropsInterface
};

export const Monochrome: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 600,
    category: SunburstChartCategory.Monochrome,
    yData: MONOCHROME_DATA
  } as SunburstChartPropsInterface
};

export const Detail: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 600,
    category: SunburstChartCategory.Detail,
    yData: DETAIL_DATA
  } as SunburstChartPropsInterface
};

export const Advance: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 600,
    category: SunburstChartCategory.Advance,
    yData: ADVANCE_DATA
  } as SunburstChartPropsInterface
};

