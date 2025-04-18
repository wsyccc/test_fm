import { Meta, StoryObj } from '@storybook/react';
import Image from './src/index';
import { ImageProvider } from "./src/context";
import { ImagePropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  tags: ['autodocs'],
  decorators: [
      (Story) => (
        <ImageProvider>
          <Story />
        </ImageProvider>
      )
    ]
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
  } as ImagePropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };