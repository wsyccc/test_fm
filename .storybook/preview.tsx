import type { Preview } from '@storybook/react'
import { Row } from '../packages/common';
import React from 'react';
import '/public/yaml.worker.js';


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  argTypes: {
    isStorybook: {
      table: {
        disable: true
      }
    },
    // 这里如果加了，所有组件都会有
    // yamlText: { control: { type: 'object' } },
  },
  decorators: [
    (Story, context) => {
      const params = context.args;

      const link = `/#/${context.kind.replace('Components/', '')}?${Object.keys(params)
        .flatMap((k) => {
          const value = params[k];
          // 过滤掉 null 或空字符串
          if (value === null || value === '' || typeof value === 'function') return [];

          // 跳过isStorybook属性
          if (k === 'isStorybook') return [];

          // 对script的事件函数做特殊处理
          // if (k === 'script') return [`${encodeURIComponent(k)}=${CryptoJS.AES.encrypt(
          //   value,
          //   "friday"
          // ).toString()}`]


          // 如果是对象，序列化为 JSON 字符串并编码
          if (typeof value === 'object' && value !== null) {
            return [
              `${encodeURIComponent(k)}=${encodeURIComponent(JSON.stringify(value))}`
            ];
          }

          return [
            `${encodeURIComponent(k)}=${encodeURIComponent(String(value))}`
          ];
        })
        .join('&')}`
      return (
        <div style={{ padding: 16 }}>
          {/* 渲染 Story 和链接 */}
          <Row justify="center" style={{ margin: '16px 0' }}>
            <Story />
          </Row>
          <Row>
            <a
              href={link}
              style={{ maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.slice(0, 50)}…
            </a>
          </Row>
        </div>
      );
    },
  ],
};

export default preview;