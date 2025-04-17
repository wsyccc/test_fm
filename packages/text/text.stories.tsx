import { Meta, StoryObj } from '@storybook/react';
import Text from './src/index';
import { TextProvider } from "./src/context";
import { TextPropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  decorators: [
      (Story) => (
        <TextProvider>
          <Story />
        </TextProvider>
      )
    ]
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
  } as TextPropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };