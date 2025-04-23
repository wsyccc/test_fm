import { Meta, StoryObj } from '@storybook/react';
import { PageRender } from './page_render';
import { Button, FloatButton, Modal } from 'antd';
import { Title, Subtitle, Description, Primary, Stories } from '@storybook/blocks';
import { useState } from 'react';
import React from 'react';
import Editor from '@monaco-editor/react';

const meta: Meta<typeof PageRender> = {
  title: 'Components/PageRender',
  component: PageRender,
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

type Story = StoryObj<typeof PageRender>;

export const Default: Story = {
  // isStorybook is required to be true
  // add some stories default args here
  args: {
    yamlText: `header:
  title:
    type: text
    value: Header
    color: red
    fontSize: 32
    border:
      style: dashed
      size: 2
      color: grey
  subtitle:
    type: text
    width: 100%
    value: Report builder Sample code
  logo:
    type: image
    src: "/public/Image/CE_Logo_Icon.png"
    width: 100%
    height: 120
footer:
  pageNo:
    visible: true
    align: end
  title:
    type: text
    value: Report Builder
    width: 100%
    color: pink
    fontSize: 24
    border:
      style: dashed
      size: 1
      color: pink
  subtitle:
    type: text
    width: 100%
    value: Copyright by @Cermate Software Inc.
  logo:
    type: image
    src: "/public/Image/CE_Logo_Web.png"
    width: 60
    height: 60
orientation: horizontal
pages:
- width: 600
  height: auto
  content:
  - type: vertical
    gap: 10
    style:
      backgroundColor: grey
    content:
    - type: horizontal
      gap: 20
      style:
        align: start
      content:
      - type: barchart
        width: 33%
        height: 200
        configs:
          color: red
      - type: gaugechart
        width: 33%
        height: 400
        configs:
          bgColor: "#18ffd8"
      - type: linechart
        width: 33%
        height: 200
    - type: protable
      width: 580
      height: 200
    - type: vertical
      style:
        align: center
      content:
      - type: barchart
        width: 400
        height: 200
      - type: gaugechart
        width: 300
        height: 200
      - type: linechart
        width: 580
        height: 200
- content:
  - type: horizontal
    width: 1800
    height: 400
    style:
      align: start
    content:
    - type: horizontal
      width: 600
      height: 200
      content:
      - type: barchart
        width: 33%
        height: 200
        configs:
          color: red
      - type: gaugechart
        width: 33%
        height: 400
        configs:
          bgColor: "#18ffd8"
      - type: linechart
        width: 33%
        height: 200
    - type: protable
      width: 600
      height: 200
    - type: vertical
      width: 600
      height: 200
      content:
      - type: barchart
        width: 400
        height: 200
      - type: gaugechart
        width: 300
        height: 200
      - type: linechart
        width: 580
        height: 200
`
  },
};
