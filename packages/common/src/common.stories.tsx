import { Meta, StoryObj } from '@storybook/react';
import { PageRender } from './page_render';
import { Button, Modal } from 'antd';
import { useState } from 'react';

const meta: Meta<typeof PageRender> = {
  title: 'Components/PageRender',
  component: PageRender,
  tags: ['autodocs'],
  argTypes: {
    yamlText: {
      control: 'text', // 使用文本框
    },
  },
  decorators: [
    (Story, context) => {
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
          <Story />
          <Button type="primary" onClick={() => setModalVisible(true)}>Edit YAML code</Button>
          <Modal
            onCancel={() => setModalVisible(false)}
            onOk={handleSave}
            open={modalVisible}>
              在这里改没啥意义，虽然能apply上，但是操作逻辑和其他组件不一样了
            <textarea
              value={editedYamlText}
              onChange={(e) => setEditedYamlText(e.target.value)}
              rows={10}
              style={{ width: '100%' }}
            />
          </Modal>
        </>
      )
    }
  ]
};

export default meta;

type Story = StoryObj<typeof PageRender>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    yamlText: `header:
  title: 
    type: "text"
    value: "Header"
    color: "red"
    fontSize: 32
    border:
      style: "dashed"
      size: 2
      color: "grey"
  subtitle: 
    type: "text"
    width: "100%"
    value: "Report builder Sample code"
  logo: 
    type: "text"
    value: "Please input your logo path"
    width: "100%"
    justifyContent: "end"

footer:
  pageNo:
    visible: true
    align: "end"
  title:
    type: "text"
    value: "Report Builder"
    width: "100%"
    color: "pink"
    fontSize: 24
    border:
      style: "dashed"
      size: 1
      color: "pink"
  subtitle:
    type: "text"
    width: "100%"
    value: "Copyright by @Cermate Software Inc."
  logo:
    type: "text"
    value: "Here is your footer logo"
    width: "100%"
    justifyContent: "end"

orientation: "horizontal"

pages:
  - content:
      - type: "vertical"
        gap: 10
        style:
          backgroundColor: "grey"
        content:
          - type: "horizontal"
            gap: 20
            style:
              align: "start"
            content:
              - type: "barchart"
                width: "33%"
                height: 200
                configs:
                  color: "red"
              - type: "gaugechart"
                width: "33%"
                height: 400
                configs:
                  bgColor: "#18ffd8"
              - type: "linechart"
                width: "33%"
                height: 200
          - type: "protable"
            width: 580
            height: 200
          - type: "vertical"
            style:
              align: "center"
            content:
              - type: "barchart"
                width: 400
                height: 200
              - type: "gaugechart"
                width: 300
                height: 200
              - type: "linechart"
                width: 580
                height: 200

  - width: 600
    height: 900
    content:
      - type: "horizontal"
        width: 600
        height: 700
        content:
          - type: "horizontal"
            width: 600
            height: 200
            content:
              - type: "barchart"
                width: 200
                height: 200
              - type: "gaugechart"
                width: 200
                height: 200
              - type: "linechart"
                width: 200
                height: 200
          - type: "protable"
            width: 600
            height: 200
          - type: "vertical"
            width: 600
            height: 200
            content:
              - type: "barchart"
                width: 600
                height: 200
              - type: "gaugechart"
                width: 600
                height: 200
              - type: "linechart"
                width: 600
                height: 200
`
  },
};
