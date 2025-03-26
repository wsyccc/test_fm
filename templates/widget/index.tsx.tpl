import React from 'react'
import { DataManager } from '@hulk/common'

export interface {{namePascal}}Props {
  title: string
}

const {{namePascal}}: React.FC<{{namePascal}}Props> = ({ title }) => {
  console.log(DataManager.getMessage())
  return <div className="{{nameKebab}}">{title}</div>
}

export default {{namePascal}}
