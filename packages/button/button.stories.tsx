import { Meta, StoryObj } from '@storybook/react';
import Button from './src/index';
import {ButtonProvider} from "./src/context";
import {ButtonPropsInterface} from "./src/type";

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ButtonProvider>
        <Story />
      </ButtonProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    id: '0',
    bgColor: 'lightblue',
  } as ButtonPropsInterface
};
