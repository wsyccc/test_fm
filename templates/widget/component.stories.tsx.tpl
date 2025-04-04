import { Meta, StoryObj } from '@storybook/react';
import {{namePascal}} from './src/index';
import { {{namePascal}}Provider } from "./src/context";
import { {{namePascal}}PropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof {{namePascal}}> = {
  title: 'Components/{{namePascal}}',
  component: {{namePascal}},
  tags: ['autodocs'],
  decorators: [
      (Story) => (
        <{{namePascal}}Provider>
          <Story />
        </{{namePascal}}Provider>
      )
    ]
};

export default meta;

type Story = StoryObj<typeof {{namePascal}}>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
  } as {{namePascal}}PropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };