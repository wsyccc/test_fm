import { Meta, StoryObj } from '@storybook/react';
import { Button, FloatButton, Modal } from 'antd';
import { Title, Subtitle, Description, Primary, Stories } from '@storybook/blocks';
import { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { configureMonacoYaml } from "monaco-yaml";
import * as monacoYaml from "monaco-yaml";
import ReportBuilder from './src/index';
import { ReportBuilderProvider } from "./src/context";
import configs from "./src/configs";

window.MonacoEnvironment = {
  getWorker: function (moduleId, label) {
    switch (label) {
      case 'yaml':
        return new Worker(
          new URL('monaco-yaml/yaml.worker.js', import.meta.url),
          { type: 'module' }
        );
      case 'json':
        return new Worker(
          new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url),
          { type: 'module' }
        );
      case 'editorWorkerService':
      default:
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          { type: 'module' }
        );
    }
  }
};

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
      const [yamlText, setYamlText] = useState<string>(`type: barchart
width: 400
height: 300
unknownProp: true`); // 从 args 中获取初始值
      const [editedYamlText, setEditedYamlText] = useState<string>(yamlText);

      const monaco = useMonaco();

      const componentSchema = {
        type: "object",
        required: ["type"],
        properties: {
          type: { enum: ["barchart", "gaugechart", "linechart"] },
          width: { type: ["number", "string"] },
          height: { type: ["number", "string"] },
          configs: { type: "object", additionalProperties: false },
          style: { type: "object", additionalProperties: false },
          content: {
            type: "array",
            items: { $ref: "#/definitions/component" } // ✅ 递归嵌套
          }
        },
        allOf: [
          {
            if: { properties: { type: { const: "barchart" } } },
            then: {
              required: ["width", "height"],
              additionalProperties: false, // ✅ 限制最外层属性
              properties: {
                type: { const: "barchart" },
                width: { type: ["string", "number"] },
                height: { type: ["string", "number"] },
                configs: {
                  type: "object",
                  properties: {
                    color: { type: "string" }
                  },
                  additionalProperties: false
                }
              }
            }
          },
          {
            if: { properties: { type: { const: "protable" } } },
            then: {
              required: ["width", "height"]
            }
          }
        ]
      };

      const schema = {
        type: "object",
        properties: {
          type: { const: "barchart" },
          width: { type: "number" },
          height: { type: "number" }
        },
        required: ["type", "width", "height"],
        additionalProperties: false
      };

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


      const handleEditorMount = async (editor: any, monacoInstance: any) => {
        const model = editor.getModel();
        if (!model) return;
        const uri = model.uri.toString(); // e.g. inmemory://model/1

        // ✅ 正确使用 configureMonacoYaml（v5.3.1）
        configureMonacoYaml(monacoInstance, {
          enableSchemaRequest: false,
          validate: true,
          hover: true,
          completion: true,
          schemas: [
            {
              uri: "inmemory://schema/barchart-schema",
              fileMatch: [uri], // ⛳️ 关键：必须绑定 model 的 URI
              schema
            }
          ]
        });
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
              onMount={handleEditorMount}
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
  },
};
