import { Meta, StoryObj } from '@storybook/react';
import {{namePascal}} from './src/index';
import { {{namePascal}}Provider } from "./src/context";
import { {{namePascal}}PropsInterface } from "./src/type";

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
  args: {
    id: '{{namePascal}} Demo',
  } as {{namePascal}}PropsInterface
};
