import { Meta, StoryObj } from '@storybook/react';
import Text from './src/index';
import { TextProvider } from "./src/context";
import { AlignItems, Fonts, TextDecorationStyle, TextPropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    fontFamily: {
      control: 'select',
      options: [...Object.values(Fonts).map((k) => {
        return k
      })]
    },
    justifyContent: {
      control: 'select',
      options: [...Object.values(AlignItems).map((k) => {
        return k
      })]
    },
    alignItems: {
      control: 'select',
      options: [...Object.values(AlignItems).map((k) => {
        return k
      })]
    },
  },
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
    bgColor: "white",
    value: 'Text',
    fontSize: 32,
    fontFamily: Fonts.arial,
    color: "black",
    justifyContent: AlignItems.center,
    alignItems: AlignItems.center,
    border: {
      style: TextDecorationStyle.dashed,
      color: "red",
      size: 1,
    },
    boxShadow: {
      x: 10,
      y: 10,
      blur: 5,
      diffusion: 5,
      color: 'grey'
    },
    textDecoration: {
      bold: false,
      italic: false,
      underline: false,
      overline: false,
      lineThrough: false,
      color: 'rgba(0,0,0,1)',
      style: TextDecorationStyle.solid,
    }
  } as TextPropsInterface
};
