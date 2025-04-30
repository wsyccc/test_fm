import { Meta, StoryObj } from "@storybook/react";
import Protable from "./src/index";
import { ProtableProvider } from "./src/context";
import { ProtablePropsInterface } from "./src/type";
import React from "react";
import { ORIGINDATA } from "./src/constants";

const meta: Meta<typeof Protable> = {
  title: "Components/Protable",
  component: Protable,
  tags: ["autodocs"],
  argTypes: {
    pageBreak: {
      description: "是否显示分页"
    },
    pageSize: {
      description: "每页有多少个records"
    },
    columnSize: {
      description: "每页有多少个columns"
    },
    currentPage: {
      description: "当前第几页"
    },
    fixedRowHeaders: {
      description: "滚动时保持标题行可见，这里用number是让标题行固定在哪个位置"
    },
    fixedColumnHeaders: {
      description: "滚动时保持首列可见"
    },
    tableName: {
      description: "表格名字"
    },
    keepColumnsTogether: {
      description: "将所有列显示在一页中，true时没有列翻页"
    },
    keepRowsTogether: {
      description: "将所有行显示在一页中，true时没有行翻页，pageBreak=false不生效"
    },
    repeatRowHeaders: {
      description: "在每一页上重复标题行"
    },
  },
  decorators: [
    (Story) => (
      <ProtableProvider>
        <Story />
      </ProtableProvider>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof Protable>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    isStorybook: true,
    width: 800,
    height: 650,
    originData: ORIGINDATA,
    pageSize: 10,
    columnSize: 3,
    tableName: "##Audit Trial",
    currentPage: 1,
    fixedRowHeaders: 0,
    fixedColumnHeaders: true,
    pageBreak: true,
    keepColumnsTogether: true,
    keepRowsTogether: false,
    repeatRowHeaders: true,

  } as ProtablePropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };