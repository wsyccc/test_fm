import { Meta, StoryObj } from '@storybook/react';
import ThreeD from './src/index';
import { ThreeDProvider } from "./src/context";
import { ThreeDPropsInterface } from "./src/type";

const meta: Meta<typeof ThreeD> = {
  title: 'Components/ThreeD',
  component: ThreeD,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // backgroundColor: { control: 'color' },
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
    id:'0',
    width: 1000,
    height: 580,
    externalSourceLink: "/3D/objExample2.obj",
    shallowTheme: true,
    ambientLight: 1.5,
    xScale: 1,
    yScale: 1,
    zScale: 1,
    transparent: true,
    alarms: [
      { name: 'obj5', color: 'red' }
    ]
  },
};

export const SimpleObj: Story = {
  args: {
    id:'0',
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
    id:'0',
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
    id:'0',
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
    id:'0',
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



