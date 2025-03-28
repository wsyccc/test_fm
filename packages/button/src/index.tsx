import React from 'react'
import {useCommon} from '@hulk/common'
import AntdButton from 'antd/es/button';

export interface ButtonProps {
  title: string
}

const Button: React.FC<ButtonProps> = ({ title }) => {
  const { count, increment } = useCommon();
  return (
    <>
      <span>{title}  {count}</span>
      <AntdButton onClick={increment} />
    </>
  );
}

export default Button
