import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Page } from './layout_render/YamlRenderer';
import { PageRender } from './page_render';

const meta: Meta<typeof PageRender> = {
  title: 'Components/PageRender',
  component: PageRender,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
        <Story />
    )
  ]
};

export default meta;

type Story = StoryObj<typeof PageRender>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  
};
