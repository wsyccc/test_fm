import { Meta, StoryObj } from '@storybook/react';
import OtherCharts from './src/index';
import { OtherChartsProvider } from "./src/context";
import { OtherChartsPropsInterface } from "./src/type";
import React from 'react';
import { OtherChartsCategory } from './src/utils';
import { COMPLEX_DATA, MULTI_TREE_DATA, TREE_DATA } from './src/constants';

const meta: Meta<typeof OtherCharts> = {
  title: 'Components/OtherCharts',
  component: OtherCharts,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [...Object.values(OtherChartsCategory).map((k) => {
        return k
      })]
    }
  },
  decorators: [
    (Story) => (
      <OtherChartsProvider>
        <Story />
      </OtherChartsProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof OtherCharts>;

export const SimpleGraph: Story = {
  args: {
    isStorybook: true,
    category: OtherChartsCategory.SimpleGraph,
    width: 400,
    height: 400,
    yData: [
      {
        name: 'Node 1',
        x: 300,
        y: 300
      },
      {
        name: 'Node 2',
        x: 800,
        y: 300
      },
      {
        name: 'Node 3',
        x: 550,
        y: 100
      },
      {
        name: 'Node 4',
        x: 550,
        y: 500
      }
    ]
  } as OtherChartsPropsInterface
};

export const GraphOnCartesian: Story = {
  args: {
    isStorybook: true,
    category: OtherChartsCategory.GraphOnCartesian,
    width: 600,
    height: 300,
    xData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    yData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (item, i) {
      return Math.round(Math.random() * 1000 * (i + 1));
    })
  } as OtherChartsPropsInterface
};

export const GraphOverlap: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 600,
    category: OtherChartsCategory.GraphOverlap,
    yData: COMPLEX_DATA
  } as OtherChartsPropsInterface
};


export const Tree: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 600,
    category: OtherChartsCategory.Tree,
    yData: TREE_DATA
  } as OtherChartsPropsInterface
};

export const MultiTrees: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 600,
    category: OtherChartsCategory.MultiTrees,
    yData: MULTI_TREE_DATA
  } as OtherChartsPropsInterface
};

export const RadialTree: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 600,
    category: OtherChartsCategory.RadialTree,
    yData: TREE_DATA
  } as OtherChartsPropsInterface
};


export const SimpleParallel: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 600,
    category: OtherChartsCategory.SimpleParallel,
    yData: [
      [12.99, 100, 82, 'Good'],
      [9.99, 80, 77, 'OK'],
      [20, 120, 60, 'Excellent']
    ]
  } as OtherChartsPropsInterface
};

export const SimpleFunnel: Story = {
  args: {
    isStorybook: true,
    width: 500,
    height: 400,
    category: OtherChartsCategory.SimpleFunnel,
    xData: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
    yData: [
      { value: 60, name: 'Visit' },
      { value: 40, name: 'Inquiry' },
      { value: 20, name: 'Order' },
      { value: 80, name: 'Click' },
      { value: 100, name: 'Show' }
    ]
  } as OtherChartsPropsInterface
};

export const RichText: Story = {
  args: {
    isStorybook: true,
    width: 700,
    height: 500,
    category: OtherChartsCategory.RichText,
    xData: ['Direct', 'Marketing', 'Search Engine', 'Email', 'Union Ads', 'Video Ads', 'Baidu', 'Google', 'Bing', 'Others'],
    yData: [
      [
        { value: 1548, name: 'Search Engine' },
        { value: 775, name: 'Direct' },
        { value: 679, name: 'Marketing', selected: true }
      ],
      [
        { value: 1048, name: 'Baidu' },
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 251, name: 'Google' },
        { value: 234, name: 'Union Ads' },
        { value: 147, name: 'Bing' },
        { value: 135, name: 'Video Ads' },
        { value: 102, name: 'Others' }
      ]
    ]
  } as OtherChartsPropsInterface
};





