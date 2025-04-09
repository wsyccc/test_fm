import { Meta, StoryObj } from '@storybook/react';
import TreeMapChart from './src/index';
import { TreeMapChartProvider } from "./src/context";
import { TreeMapChartPropsInterface } from "./src/type";
import React from 'react';
import { TreeMapChartCategory } from './src/utils';
import { DISKTREE_DATA } from './src/constants';

const meta: Meta<typeof TreeMapChart> = {
  title: 'Components/TreeMapChart',
  component: TreeMapChart,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [...Object.values(TreeMapChartCategory).map((k) => {
        return k
      })]
    },
  },
  decorators: [
    (Story) => (
      <TreeMapChartProvider>
        <Story />
      </TreeMapChartProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof TreeMapChart>;

export const Default: Story = {
  args: {
    isStorybook: true,
    width: 400,
    height: 300,
    category: TreeMapChartCategory.Basic,
    yData: [
      {
        name: 'nodeA',
        value: 10,
        children: [
          {
            name: 'nodeAa',
            value: 4
          },
          {
            name: 'nodeAb',
            value: 6
          }
        ]
      },
      {
        name: 'nodeB',
        value: 20,
        children: [
          {
            name: 'nodeBa',
            value: 20,
            children: [
              {
                name: 'nodeBa1',
                value: 20
              }
            ]
          }
        ]
      }
    ]
  } as TreeMapChartPropsInterface
};

export const Complex: Story = {
  args: {
    isStorybook: true,
    width: 900,
    height: 600,
    category: TreeMapChartCategory.Complex,
    yData: DISKTREE_DATA
  } as TreeMapChartPropsInterface
};