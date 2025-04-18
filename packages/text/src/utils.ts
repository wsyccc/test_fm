import { TextPropsInterface } from "./type";

export function textFormFormatter(configs: Partial<TextPropsInterface>) {
  let result = {} as Record<string, string>;
  Object.keys(configs).forEach((key) => {
    const config = configs[key];

    if (typeof config !== 'object') {
      result = {
        ...result,
        [key]: config,
      };
    } else {
      switch (key) {
        case 'border':
          result = {
            ...result,
            border: `${config.size}px ${config.style} ${config.color}`,
          };
          break;
        case 'boxShadow':
          result = {
            ...result,
            boxShadow: `${config.x}px ${config.y}px ${config.blur}px ${config.diffusion}px ${config.color}`,
          };
          break;
        case 'borderRadius':
          result = {
            ...result,
            borderRadius: `${config.data.topLeft} ${config.data.topRight} ${config.data.bottomRight} ${config.data.bottomLeft}`,
          };
          break;
        case 'textDecoration':
          result = {
            ...result,
            fontStyle: `${config.italic ? 'italic' : ''}`,
            fontWeight: `${config.bold ? 'bold' : ''}`,
            textDecorationLine: `${config.underline ? 'underline' : ''} ${config.overline ? 'overline' : ''
              } ${config.lineThrough ? 'line-through' : ''}`,
            textDecorationColor: config.color,
            textDecorationStyle: config.style,
          };
      }
    }

  });
  return result;
}