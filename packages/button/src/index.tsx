import React from 'react'
import { DataManager } from '@hulk/common'

export interface ButtonProps {
  title: string
}

const Button: React.FC<ButtonProps> = ({ title }) => {
  console.log(DataManager.getMessage())
  return <div className="button">{title}</div>
}

export default Button
