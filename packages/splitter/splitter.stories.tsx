import { Meta, StoryObj } from '@storybook/react';
import Splitter from './src/index';
import { SplitterProvider } from "./src/context";
import { SplitterPropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof Splitter> = {
  title: 'Components/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal']
    }
  },
  decorators: [
    (Story) => (
      <SplitterProvider>
        <Story />
      </SplitterProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Splitter>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    width: 200,
    height: 120,
    bgColor: '',
    direction: '',
    layout: [
      { title: 'Left' },
      { title: 'Right' },
    ]
  } as SplitterPropsInterface
};

export const Advance: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    width: 400,
    height: 160,
    bgColor: 'red',
    direction: '',
    layout: [
      { title: 'Left', collapsible: true },
      [
        { title: 'Top', min: "20%" },
        { title: 'Bottom', min: 30 },
      ],
    ]
  } as SplitterPropsInterface
};

export const Complex: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    width: 600,
    height: 400,
    direction: '',
    layout: [
      [
        { title: 'LeftTop', collapsible: true, min: 50, defaultSize: 100, stylish: { color: 'red', fontSize: 24 } },
        { title: 'LeftBottom', min: 50, max: 450, style: { backgroundColor: "#1890ff" } },
      ],
      [
        { collapsible: true, resizable: false },
        { title: 'Top', min: 50, collapsible: true },
        [
          { min: 100 },
          { title: 'Bottom1', min: 30 },
          { title: 'Bottom2', min: 30 },
          { title: 'Bottom3', min: 30, resizable: false },
        ]

      ],
    ]
  } as SplitterPropsInterface
};

export const ComplexWithDiffDirection: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 400,
    direction: 'vertical',
    layout: [
      [
        // style是给label的parent dom用的
        // stylish是给label自己用的
        { title: 'LeftTop', collapsible: true, min: 50, defaultSize: 100, stylish: { color: 'red', fontSize: 24 } },
        { title: 'LeftBottom', min: 50, max: 450, style: { backgroundColor: "#1890ff" } },
      ],
      [
        { collapsible: true, resizable: false },
        { title: 'Top', min: 50, collapsible: true },
        [
          { min: 100 },
          { title: 'Bottom1', min: 30 },
          { title: 'Bottom2', min: 30 },
          { title: 'Bottom3', min: 30, resizable: false },
        ]

      ],
    ]
  } as SplitterPropsInterface
};
