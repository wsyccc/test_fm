import { parseDocument } from 'yaml';
import { BaseWidgetConfigType, StackType, StyleConfig } from "../../type";
import { WidgetType } from '../../constants';
// import { TextPropsInterface } from '@packages/text/src/type';
// import { ImagePropsInterface } from '@packages/image/src/type';

export interface YamlWidget extends BaseWidgetConfigType {
  style?: StyleConfig;
}


export type CardConfig = YamlWidget | StackCard;

export interface StackCard {
  type: StackType | WidgetType;
  // 如果type是StackType.widget的话，content应该没有东西，
  content?: StackCard[];
  // 如果type不是StackType.widget的话，说明还是layout，还没到widget，所以configs应该是undefined
  configs?: Record<string, any>;
  width?: string | number;
  height?: string | number;
  // style是这个layout或者widget的背景图片、背景颜色等等
  style?: StyleConfig;
  // 内容里面stackCard之间的间距
  gap?: number
}


export interface Page {
  width?: string | number;
  height?: string | number;
  // 要注意page里面content的StackCard长度应该为1，且类型大概率为StackType，如果类型不为StackType，那表示整个page只有一个Widget
  content?: StackCard[];
}

// interface Text extends TextPropsInterface {
//   type: WidgetType.text;
// }

// interface Image extends ImagePropsInterface {
//   type: WidgetType.image;
// }

export interface Report {
  header?: {
    title?: StackCard;
    subtitle?: StackCard;
    logo?: StackCard;
    width?: string | number;
    height?: string | number;
  },
  footer?: {
    pageNo: {
      visible: boolean;
      align?: 'start' | 'end' | 'center'
    },
    title?: StackCard;
    subtitle?: StackCard;
    logo?: StackCard;
    width?: string | number;
    height?: string | number;
  },
  orientation: "horizontal" | "vertical",
  pages: Page[]
}

export class YamlParser {
  private config: Report | null = null;
  private error: string | null = null;

  constructor(yamlText: string) {
    this.parseYaml(yamlText);
  }

  private parseYaml(yamlStr: string) {
    try {
      const doc = parseDocument(yamlStr);
      const parsed = doc.toJSON() as Report;
      this.config = parsed;
      this.error = null;
    } catch (err: any) {
      this.config = null;
      this.error = err.message || 'YAML Parse Error';
    }
  }

  public getConfig(): Report | null {
    return this.config;
  }

  public getError(): string | null {
    return this.error;
  }
}