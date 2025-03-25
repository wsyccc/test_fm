import { Meta, StoryObj } from '@storybook/react';
import {{namePascal}} from './src/index';

const meta: Meta<typeof {{namePascal}}> = {
  title: 'Components/{{namePascal}}',
  component: {{namePascal}},
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof {{namePascal}}>;

export const Default: Story = {
  args: {
    title: '{{namePascal}} Demo'
  }
};
