import React from 'react'

export interface {{namePascal}}Props {
  title: string
}

const {{namePascal}}: React.FC<{{namePascal}}Props> = ({ title }) => {
  return <div className="{{nameKebab}}">{title}</div>
}

export default {{namePascal}}
