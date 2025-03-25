import React from 'react'
import {getMessage} from '@hulk/common';

export interface ButtonProps {
  title: string
}

const Button: React.FC<ButtonProps> = ({ title }) => {
  console.log(getMessage());
  return <div className="button">{title}</div>
}

export default Button
