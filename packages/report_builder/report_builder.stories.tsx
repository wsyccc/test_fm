import { Meta, StoryObj } from '@storybook/react';
import ReportBuilder from './src/index';
import { ReportBuilderPropsInterface } from "./src/type";
import {Description, Primary, Subtitle, Title} from "@storybook/blocks";
import {useState} from "react";
import Editor from "@monaco-editor/react";
import {Button, Modal} from "@hulk/common";
import {ReportBuilderProvider} from "./src/context";
import configs from "./src/configs";

const meta: Meta<typeof ReportBuilder> = {
  title: 'Components/ReportBuilder',
  component: ReportBuilder,
  tags: ['autodocs'],
  argTypes: {
    yamlText: {
      control: 'text', // 使用文本框
    },
  },
  parameters: {
    docs: {
      page: () => {
        return (
          <>
            <Title />
            <Subtitle />
            <Description />
            <Primary />
          </>
        )
      },
    },
  },
  decorators: [
    (Story, context: { args: { yamlText?: string } }) => {
      const [modalVisible, setModalVisible] = useState<boolean>(false);
      const [yamlText, setYamlText] = useState<string>(context.args.yamlText || ''); // 从 args 中获取初始值
      const [editedYamlText, setEditedYamlText] = useState<string>(yamlText);

      // 保存编辑后的 YAML
      const handleSave = () => {
        try {

          // const parsed = yaml.load(editedYamlText);

          context.args.yamlText = editedYamlText;
          setYamlText(editedYamlText);
          setModalVisible(false);
        } catch (error) {
          console.error('Invalid YAML:', error);
        }
      };

      return (
        <>
          <style>
            {`
                /* 隐藏 第二、第三 列（如果不需要隐藏，删掉下面这段即可） */
                .sbdocs .docblock-argstable thead th:nth-child(2),
                .sbdocs .docblock-argstable tbody td:nth-child(2) {
                  display: none !important;
                }
                .sbdocs .docblock-argstable thead th:nth-child(3),
                .sbdocs .docblock-argstable tbody td:nth-child(3) {
                  display: none !important;
                }
                /* 将 Control 列（第 4 列）宽度设为 450px */
                .sbdocs .docblock-argstable thead th:nth-child(4),
                .sbdocs .docblock-argstable tbody td:nth-child(4) {
                  width: 450px !important;
                }
              `}
          </style>
          <ReportBuilderProvider>
            <Story />
          </ReportBuilderProvider>
          {/* <FloatButton
            type="primary"
            onClick={() => setModalVisible(true)}
            shape="square"
            description="Edit YAML"
            style={{ right: 24 }}
          /> */}
          <Button
            type="primary"
            style={{
              marginTop: '30px'
            }}
            onClick={() => setModalVisible(true)}>
            Edit YAML code
          </Button>
          <Modal
            onCancel={() => setModalVisible(false)}
            onOk={handleSave}
            width='60vw'
            open={modalVisible}>
            <Editor
              height="500px"
              defaultLanguage="yaml"
              defaultValue={editedYamlText}
              onChange={(v) => v && setEditedYamlText(v)}
              options={{
                automaticLayout: true,
                scrollBeyondLastColumn: 0,
                folding: true,
                lineNumbers: 'on'
              }}
            />
          </Modal>
        </>
      )
    }
  ]
};

export default meta;

type Story = StoryObj<typeof ReportBuilder>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    yamlText: configs.yamlText,
    isStorybook: true,
  } as ReportBuilderPropsInterface
};

// can add more stories here with different args
// export const SecondStory: Story = {
//   args: {
//     isStorybook: true,
//   },
// };