import React from 'react';
import { DataManager } from '@hulk/common';
import { AntDesignOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import ConfigProvider from 'antd/es/config-provider';
import Space from 'antd/es/space';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const App: React.FC = () => {
  const { styles } = useStyle();

  console.log(DataManager.getMessage());

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Space>
        <Button type="primary" size="large" icon={<AntDesignOutlined />}>
          Gradient Button
        </Button>
        <Button size="large">Button</Button>
      </Space>
    </ConfigProvider>
  );
};

export default App;