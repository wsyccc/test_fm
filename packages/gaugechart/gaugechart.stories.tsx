import { Meta, StoryObj } from "@storybook/react";
import Gaugechart from "./src/index";
import { GaugechartProvider } from "./src/context";
import { GaugechartPropsInterface } from "./src/type";
import React from "react";

const meta: Meta<typeof Gaugechart> = {
  title: "Components/Gaugechart",
  component: Gaugechart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <GaugechartProvider>
        <Story />
      </GaugechartProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Gaugechart>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    bgColor: "#ffffff",
    color: "#1890ff",
    axisColor: "#000",
    progress: false,
    startAngle: 200,
    endAngle: -20,
    splitNumber: 10,
    labelDistance: -50,
    min: 0,
    max: 100,
    intervals: [],
    value: 50,
    fontSize: 15,
    prefix: "",
    suffix: "",
  } as GaugechartPropsInterface
};

export const Progress: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    bgColor: "#ffffff",
    color: "#1890ff",
    axisColor: "#000",
    progress: true,
    startAngle: 200,
    endAngle: -20,
    splitNumber: 10,
    labelDistance: -50,
    min: 0,
    max: 100,
    intervals: [],
    value: 50,
    fontSize: 15,
    prefix: "",
    suffix: "",
  } as GaugechartPropsInterface
};


export const Stage: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    bgColor: "#ffffff",
    color: "#1890ff",
    axisColor: "#1890ff",
    startAngle: 200,
    endAngle: -20,
    splitNumber: 10,
    labelDistance: -40,
    min: 0,
    max: 100,
    intervals: [
      [0.3, "#67e0e3"],
      [0.7, "#37a2da"],
      [1, "#fd666d"]
    ],
    value: 50,
    fontSize: 15,
    prefix: "",
    suffix: "",
  } as GaugechartPropsInterface
};

export const Sector: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    bgColor: "#ffffff",
    color: "#f50000",
    axisColor: "#1890ff",
    startAngle: 135,
    endAngle: 45,
    splitNumber: 4,
    labelDistance: -40,
    min: 0,
    max: 60,
    intervals: [
      [0.25, "#67df20"],
      [0.5, "#ede071"],
      [0.75, "#ef8511"],
      [1, "#f50000"],
    ],
    value: 50,
    fontSize: 15,
    prefix: "T:",
    suffix: "℃",
  } as GaugechartPropsInterface
};