import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  argTypes: {
    isStoryBook: {
      table: {
        disable: true
      }
    }
  },
};

export default preview;