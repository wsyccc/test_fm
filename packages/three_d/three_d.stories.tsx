import { Meta, StoryObj } from "@storybook/react";
import ThreeD from "./src/index";
import { ThreeDProvider } from "./src/context";
import React from "react";
import { cameraPosition } from "three/webgpu";

const meta: Meta<typeof ThreeD> = {
  title: "Components/ThreeD",
  component: ThreeD,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // backgroundColor: { control: "color" },
  },
  decorators: [
    (Story) => (
      <ThreeDProvider>
        <Story />
      </ThreeDProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ThreeD>;


export const DefaultObj: Story = {
  args: {
    isStorybook: true,
    width: 1000,
    height: 580,

    externalSourceLink: "/3D/objExample2.obj",
    shallowTheme: true,
    wireframe: false,
    transparent: true,
    grid: true,

    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    cameraPosition: {
      x: 15.280475853474545,
      y: 30.977834647277273,
      z: 40.76467013638617
    },
    controlsTarget: {
      x: -2.615881235563659,
      y: 19.160965686342387,
      z: -3.262830296569124
    },
    focusItemName: "obj5",
    updatedConfigs: [
      {
        name: "obj5",
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        scale: {
          x: 1,
          y: 1,
          z: 1
        },
        color: "red"
      }
    ]
  },
};

export const SimpleObj: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 300,
    externalSourceLink: "/3D/objExample.obj",
    shallowTheme: true,
    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    transparent: true,
  },
};

export const CameraObj: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/objExample3.obj",
    shallowTheme: true,
    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    transparent: true,
  },
};

export const GLTF: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/DamagedHelmet.gltf",
    shallowTheme: true,
    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    transparent: true,
  },
};

export const STL: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/stlExample.stl",
    shallowTheme: true,
    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    transparent: true,
  },
};



