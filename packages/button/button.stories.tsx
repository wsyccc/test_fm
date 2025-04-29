import { Meta, StoryObj } from "@storybook/react";
import Button from "./src/index";
import { ButtonProvider } from "./src/context";
import { ButtonPropsInterface } from "./src/type";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
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
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
  } as ButtonPropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };