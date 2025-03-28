import { Meta, StoryObj } from '@storybook/react';
import Button from './src/index';
import { CommonProvider } from '@hulk/common';
import type {ButtonPropsInterface} from "./src/type";

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CommonProvider<ButtonPropsInterface>>
        <Story />
      </CommonProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    title: 'Button Demo'
  }
};
