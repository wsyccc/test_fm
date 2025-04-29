import { Meta, StoryObj } from "@storybook/react";
import GeoChart from "./src/index";
import { GeoChartProvider } from "./src/context";
import { GeoChartPropsInterface } from "./src/type";
import React from "react";
import { GeoChartCategory } from "./src/utils";

const meta: Meta<typeof GeoChart> = {
  title: "Components/GeoChart",
  component: GeoChart,
  tags: ["autodocs"],
  argTypes: {
    category: {
      table: {
        disable: true
      }
    }
  },
  decorators: [
      (Story) => (
        <GeoChartProvider>
          <Story />
        </GeoChartProvider>
      )
    ]
};

export default meta;

type Story = StoryObj<typeof GeoChart>;

export const Default: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 580,
    category:GeoChartCategory.SVG,
    externalSourceLink: "/geo/Veins_Medical_Diagram_clip_art.svg",
  } as GeoChartPropsInterface
};

export const SVGScatter: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 580,
    category: GeoChartCategory.SVGScatter,
    externalSourceLink: "/geo/Map_of_Iceland.svg",
  } as GeoChartPropsInterface
};

export const SVGAnimation: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 580,
    category: GeoChartCategory.SVGAnimation,
    externalSourceLink: "/geo/ksia-ext-plan-min.svg",
  } as GeoChartPropsInterface
};

export const SVGLine: Story = {
  args: {
    isStorybook: true,
    width: 800,
    height: 580,
    category: GeoChartCategory.SVGLine,
    externalSourceLink: "/geo/MacOdrum-LV5-floorplan-web.svg",
  } as GeoChartPropsInterface
};