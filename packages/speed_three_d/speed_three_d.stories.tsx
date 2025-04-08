import { Meta, StoryObj } from '@storybook/react';
import SpeedThreeD from './src/index';
import { SpeedThreeDProvider } from "./src/context";
import { SpeedThreeDPropsInterface } from "./src/type";
import React from 'react';

const meta: Meta<typeof SpeedThreeD> = {
  title: 'Components/SpeedThreeD',
  component: SpeedThreeD,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SpeedThreeDProvider>
        <Story />
      </SpeedThreeDProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof SpeedThreeD>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    width: 800,
    height: 580,
    externalSourceLink: "/3D/objExample2.obj",
    alarms: [
      { name: 'obj5', color: 'red' }
    ]
  } as SpeedThreeDPropsInterface
};


export const SimpleObj: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 300,
    externalSourceLink: "/3D/objExample.obj",
  } as SpeedThreeDPropsInterface,
};

export const CameraObj: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/objExample3.obj"
  } as SpeedThreeDPropsInterface,
};

export const GLTF: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/DamagedHelmet.gltf"
  } as SpeedThreeDPropsInterface,
};

export const STL: Story = {
  args: {
    isStorybook: true,
    width: 600,
    height: 380,
    externalSourceLink: "/3D/stlExample.stl"
  } as SpeedThreeDPropsInterface,
};




