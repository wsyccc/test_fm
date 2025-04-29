import { Meta, StoryObj } from "@storybook/react";
import { Button, Modal } from "antd";
import { Title, Subtitle, Description, Primary } from "@storybook/blocks";
import { useEffect, useState, useRef } from "react";
import React from "react";
import ReportBuilder from "./src/index";
import { ReportBuilderProvider } from "./src/context";
import configs from "./src/configs";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { configureMonacoYaml } from "monaco-yaml";
import { WidgetType } from "../common";
import { StackType } from "./src/type";
import schemaMap from "./src/layout_render/cache";

if (typeof window !== "undefined") {
  self.MonacoEnvironment = {
    getWorker: function (_, label) {

      if (label === "yaml" || label === "editorWorkerService") {
        return new Worker(
          new URL("monaco-yaml/yaml.worker.js", import.meta.url),
          { type: "module" }
        );
      }

      // 默认回退
      return new Worker(
        new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
        { type: "module" }
      );
    }
  };
}

const baseComponentProperties = {
  type: { enum: [...Object.values(WidgetType), ...Object.values(StackType)] },
  width: { type: ["number", "string"] },
  height: { type: ["number", "string"] },
  bgColor: { type: "string" },
  configs: { type: "object", additionalProperties: true },
  content: {
    type: "array",
    items: { $ref: "#/definitions/component" }
  }
};

function convertAtoB(standardSchema: any, definitions: Record<string, any> = {}): Record<string, any> {
  const result: Record<string, any> = {};
  const requiredKeys = new Set(standardSchema.required || []);

  for (const [key, value] of Object.entries(standardSchema.properties || {})) {
    if (typeof value !== 'object' || value === null) continue;

    const { type, enum: enumValues, items, properties, additionalProperties, $ref, ...rest } = value as any;
    const newField: Record<string, any> = {};

    if ($ref) {
      const refKey = $ref.replace("#/definitions/", "");
      const def = definitions[refKey];
      if (def) {
        // 展开 definition 里的定义
        Object.assign(newField, { type: def.type });
        if (def.enum) newField.enum = def.enum;
      } else {
        // 找不到 definition，保留原始$ref（或者这里可以报错，看你要不要）
        console.warn(`⚠️ Warning: cannot resolve ref: ${$ref}`);
        newField.$ref = $ref;
      }
    } else {
      if (type) newField.type = type;
      if (enumValues) newField.enum = enumValues;
      if (items) newField.items = items;
      if (properties) newField.properties = properties;
      if (additionalProperties !== undefined) newField.additionalProperties = additionalProperties;
      Object.assign(newField, rest);
    }

    newField.required = requiredKeys.has(key);

    result[key] = newField;
  }

  return result;
}



function makeWidgetSchema(widgetType: WidgetType | StackType, widgetProps: Record<string, any>) {
  if (widgetType === WidgetType.report_builder) return {};
  const properties: Record<string, any> = {};
  const required: string[] = [];
  let definitions: Record<string, any> = {};

  const { content, configs, ...rest } = baseComponentProperties;

  if (widgetType === StackType.horizontal || widgetType === StackType.vertical) {
    return {
      if: { properties: { type: { const: widgetType } } },
      then: {
        type: "object",
        properties: {
          ...rest,
          content,
          gap: {
            type: "number",
            required: false
          },
          style: {
            configs: { type: "object", additionalProperties: true },
          },
        },
        additionalProperties: false
      }
    }
  }

  if (widgetType === WidgetType.linechart) {
    widgetProps = convertAtoB(widgetProps);
  }

  // ===统一处理（无论是原始B格式，还是转过来的B格式）===
  for (const [key, prop] of Object.entries(widgetProps)) {
    if (key === "definitions") {
      definitions = prop;
      continue;
    }

    const { required: isRequired, ...rest } = prop as any;
    properties[key] = rest;
    if (isRequired === true) {
      required.push(key);
    }
  }

  const tempSchema: any = {
    if: { properties: { type: { const: widgetType } } },
    then: {
      type: "object",
      properties: {
        ...rest,
        configs,
        ...properties
      },
      required: [...required],
      additionalProperties: false
    }
  };

  if (Object.keys(definitions).length > 0) {
    tempSchema.then.definitions = definitions;
  }

  return tempSchema;
}

const meta: Meta<typeof ReportBuilder> = {
  title: "Components/ReportBuilder",
  component: ReportBuilder,
  tags: ["autodocs"],
  argTypes: {
    yamlText: {
      control: "text",
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
      const [yamlText, setYamlText] = useState(context.args.yamlText || "");
      const [editedYamlText, setEditedYamlText] = useState(yamlText);
      const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
      const [hasError, setHasError] = useState<boolean>(false);

      // 搜集所有widgetType的schema里面的definition，注意重名问题
      const collectedDefinitions: Record<string, any> = {};
      // 搜集所有widgetType的schema里面的属性
      // const collectedWidgetProps = Object.assign(
      //   {},
      //   ...Object.values(WidgetType).map((widgetType) => {
      //     const schema = schemaMap[widgetType];
      //     if (!schema) return {};

      //     const processedProps: Record<string, any> = {};

      //     for (const [key, prop] of Object.entries(schema)) {
      //       if (key !== "definitions") {
      //         const { required: _required, ...rest } = prop as any;
      //         processedProps[key] = { ...rest, required: false };
      //       }
      //     }

      //     return processedProps;
      //   })
      // );

      Object.values(WidgetType).map((widgetType) => {
        const schema = schemaMap[widgetType];
        if (!schema) return {};

        for (const [key, prop] of Object.entries(schema)) {
          if (key === "definitions") {
            Object.assign(collectedDefinitions, prop);
          }
        }

      })


      const componentSchema = {
        type: "object",
        required: ["type"],
        properties: {
          ...baseComponentProperties,
          gap: { type: "number" },
          style: { type: "object", additionalProperties: true },
          // ...collectedWidgetProps
        },
        // 这里的additionalProperties需要设置为true，否则collectedWidgetProps就要挂载到properties里面会有同名属性污染问题
        additionalProperties: true,
        allOf: [

          makeWidgetSchema(StackType.horizontal, {}),
          makeWidgetSchema(StackType.vertical, {}),
          ...Object.values(WidgetType).map((widgetType) =>
            makeWidgetSchema(widgetType, schemaMap[widgetType])
          )
        ]
      };

      const schema = {
        type: "object",
        required: ["orientation", "pages"],
        properties: {
          header: {
            type: "object",
            properties: {
              title: { $ref: "#/definitions/component" },
              subtitle: { $ref: "#/definitions/component" },
              logo: { $ref: "#/definitions/component" },
              width: { type: ["string", "number"] },
              height: { type: ["string", "number"] },
              bgColor: { type: "string"}
            },
            additionalProperties: false
          },
          footer: {
            type: "object",
            properties: {
              pageNo: {
                type: "object",
                required: ["visible"],
                properties: {
                  visible: { type: "boolean" },
                  align: { enum: ["start", "center", "end"] }
                },
                additionalProperties: false
              },
              title: { $ref: "#/definitions/component" },
              subtitle: { $ref: "#/definitions/component" },
              logo: { $ref: "#/definitions/component" },
              width: { type: ["string", "number"] },
              height: { type: ["string", "number"] },
              bgColor: { type: "string"},
            },
            additionalProperties: false
          },
          orientation: { enum: ["horizontal", "vertical"] },
          pages: {
            type: "array",
            items: {
              type: "object",
              required: ["content"],
              properties: {
                width: { type: ["number", "string"] },
                height: { type: ["number", "string"] },
                content: {
                  type: "array",
                  items: { $ref: "#/definitions/component" }
                }
              },
              additionalProperties: false
            }
          }
        },
        definitions: {
          ...collectedDefinitions,
          component: componentSchema,
        }
      };

      const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
        const model = editor.getModel();
        if (!model) return;

        monacoInstance.editor.setModelLanguage(model, "yaml");

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

        monacoInstance.editor.onDidChangeMarkers(() => {
          const markers = monacoInstance.editor.getModelMarkers({ resource: model.uri });
          const hasError = markers.some(marker => marker.severity === monacoInstance.MarkerSeverity.Error
            //  || marker.severity === monacoInstance.MarkerSeverity.Warning
          );
          if (hasError) {
            setHasError(true);
          } else {
            setHasError(false);
          }

          console.log(console.log("componentSchema", JSON.stringify(schema, null, 2)))
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
          <Button type="primary" style={{ marginTop: "30px" }} onClick={() => setModalVisible(true)}>
            Edit YAML code
          </Button>

          <Modal
            onCancel={() => setModalVisible(false)}
            onOk={handleSave}
            okButtonProps={{
              disabled: hasError
            }}
            width="60vw"
            open={modalVisible}>
            <Editor
              height="500px"
              language="yaml"
              defaultLanguage="yaml"
              defaultValue={yamlText}
              onChange={(v) => v && setEditedYamlText(v)}
              options={{
                minimap: { enabled: true },
                glyphMargin: true, // 显示错误图标
                renderValidationDecorations: "on", // 显示行内错误
                lineNumbers: "on",
                tabSize: 2
              }}
              onMount={handleEditorMount}
            />
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