import { Meta, StoryObj } from '@storybook/react';
import { Button, Modal } from 'antd';
import { Title, Subtitle, Description, Primary } from '@storybook/blocks';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import ReportBuilder from './src/index';
import { ReportBuilderProvider } from "./src/context";
import configs from "./src/configs";
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { configureMonacoYaml } from 'monaco-yaml';
import { WidgetType } from '../common';

if (typeof window !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function (_, label) {

      if (label === 'yaml' || label === 'editorWorkerService') {
        return new Worker(
          new URL('monaco-yaml/yaml.worker.js', import.meta.url),
          { type: 'module' }
        );
      }

      // 默认回退
      return new Worker(
        new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
        { type: 'module' }
      );
    }
  };
}


const meta: Meta<typeof ReportBuilder> = {
  title: 'Components/ReportBuilder',
  component: ReportBuilder,
  tags: ['autodocs'],
  argTypes: {
    yamlText: {
      control: 'text',
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
        </>
      ),
    },
  },
  decorators: [
    (Story, context) => {
      const [modalVisible, setModalVisible] = useState(false);
      const [yamlText, setYamlText] = useState(context.args.yamlText || '');
      const [editedYamlText, setEditedYamlText] = useState(yamlText);
      const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

      const componentSchema = {
        type: 'object',
        required: ['type'],
        properties: {
          type: { enum: Object.values(WidgetType) },
          width: { type: ['number', 'string'] },
          height: { type: ['number', 'string'] },
          configs: { type: 'object', additionalProperties: false },
          style: { type: 'object', additionalProperties: false },
          content: {
            type: 'array',
            items: { $ref: '#/definitions/component' }
          }
        },
        additionalProperties: false,
        allOf: [
          {
            if: { properties: { type: { const: 'barchart' } } },
            then: {
              required: ['width', 'height'],
              properties: {
                configs: {
                  type: 'object',
                  properties: {
                    color: { type: 'string' }
                  },
                  additionalProperties: false
                }
              }
            }
          },
          {
            if: { properties: { type: { const: 'protable' } } },
            then: {
              required: ['width', 'height']
            }
          }
        ]
      };

      const schema = {
        type: 'object',
        required: ['orientation', 'pages'],
        properties: {
          header: {
            type: 'object',
            properties: {
              title: { $ref: '#/definitions/component' },
              subtitle: { $ref: '#/definitions/component' },
              logo: { $ref: '#/definitions/component' },
              width: { type: ['string', 'number'] },
              height: { type: ['string', 'number'] }
            },
            additionalProperties: false
          },
          footer: {
            type: 'object',
            properties: {
              pageNo: {
                type: 'object',
                required: ['visible'],
                properties: {
                  visible: { type: 'boolean' },
                  align: { enum: ['start', 'center', 'end'] }
                },
                additionalProperties: false
              },
              title: { $ref: '#/definitions/component' },
              subtitle: { $ref: '#/definitions/component' },
              logo: { $ref: '#/definitions/component' },
              width: { type: ['string', 'number'] },
              height: { type: ['string', 'number'] }
            },
            additionalProperties: false
          },
          orientation: { enum: ['horizontal', 'vertical'] },
          pages: {
            type: 'array',
            items: {
              type: 'object',
              required: ['content'],
              properties: {
                width: { type: ['number', 'string'] },
                height: { type: ['number', 'string'] },
                content: {
                  type: 'array',
                  items: { $ref: '#/definitions/component' }
                }
              },
              additionalProperties: false
            }
          }
        },
        definitions: {
          component: componentSchema
        }
      };

      const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        const model = editor.getModel();
        if (!model) return;

        monacoInstance.editor.setModelLanguage(model, 'yaml');

        configureMonacoYaml(monacoInstance, {
          validate: true,
          completion: true,
          hover: true,
          enableSchemaRequest: false,
          schemas: [
            {
              uri: model.uri.toString(),
              fileMatch: [model.uri.toString()],
              schema,
            },
          ],
        });
      };

      const handleSave = () => {
        context.args.yamlText = editedYamlText;
        setYamlText(editedYamlText);
        setModalVisible(false);
      };

      return (
        <>
          <style>
            {`
              .sbdocs .docblock-argstable thead th:nth-child(2),
              .sbdocs .docblock-argstable tbody td:nth-child(2),
              .sbdocs .docblock-argstable thead th:nth-child(3),
              .sbdocs .docblock-argstable tbody td:nth-child(3) {
                display: none !important;
              }
              .sbdocs .docblock-argstable thead th:nth-child(4),
              .sbdocs .docblock-argstable tbody td:nth-child(4) {
                width: 450px !important;
              }
            `}
          </style>
          <ReportBuilderProvider>
            <Story />
          </ReportBuilderProvider>
          <Button type="primary" style={{ marginTop: '30px' }} onClick={() => setModalVisible(true)}>
            Edit YAML code
          </Button>
          <Editor
            height="500px"
            language="yaml"
            defaultLanguage="yaml"
            defaultValue={yamlText}
            onChange={(v) => v && setEditedYamlText(v)}
            options={{
              minimap: { enabled: true },
              glyphMargin: true, // 显示错误图标
              renderValidationDecorations: 'on', // 显示行内错误
              lineNumbers: 'on',
              tabSize: 2
            }}
            onMount={handleEditorMount}
          />
          <Modal
            onCancel={() => setModalVisible(false)}
            onOk={handleSave}
            width='60vw'
            open={modalVisible}>
          </Modal>
        </>
      );
    }
  ]
};

export default meta;

type Story = StoryObj<typeof ReportBuilder>;

export const Default: Story = {
  args: {
    yamlText: configs.yamlText,
    isStorybook: true,
  },
};