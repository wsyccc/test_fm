import { Meta, StoryObj } from '@storybook/react';
import DynamicBarchart from './src/index';
import { DynamicBarchartProvider } from "./src/context";
import { DynamicBarchartPropsInterface } from "./src/type";
import React from 'react';
import { DynamicBarChartCategory } from './src/utils';

const meta: Meta<typeof DynamicBarchart> = {
  title: 'Components/DynamicBarchart',
  component: DynamicBarchart,
  tags: ['autodocs'],
  argTypes: {
    category: {
      table:{
        disable:true
      }
    },
  },
  decorators: [
    (Story) => (
      <DynamicBarchartProvider>
        <Story />
      </DynamicBarchartProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof DynamicBarchart>;

export const Dynamic: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 400,
    category: DynamicBarChartCategory.Dynamic
  } as DynamicBarchartPropsInterface
};

export const Race: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 400,
    category: DynamicBarChartCategory.Race
  } as DynamicBarchartPropsInterface
};

export const Animation: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 400,
    category: DynamicBarChartCategory.Animation
  } as DynamicBarchartPropsInterface
};


export const Drilldown: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 400,
    category: DynamicBarChartCategory.Drilldown
  } as DynamicBarchartPropsInterface
};

export const LargeScale: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 400,
    category: DynamicBarChartCategory.LargeScale
  } as DynamicBarchartPropsInterface
};

export const Finance: Story = {
  args: {
    isStorybook: true,
    width: 1000,
    height: 500,
    category: DynamicBarChartCategory.Finance
  } as DynamicBarchartPropsInterface
};