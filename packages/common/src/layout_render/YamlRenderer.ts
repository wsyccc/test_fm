import { parseDocument } from 'yaml';
import { BaseWidgetConfigType, StackType, StyleConfig } from "../../type";
import { CSSProperties } from "react";
import { WidgetType } from '../../constants';

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
}

export interface StackLoader {
  width?: string | number;
  height?: string | number;
  content: StackCard[]
}

export interface Page {
  name: string;
  width?: string | number;
  height?: string | number;
  header?: {
    title?: string | React.ReactNode;
    logo?: string | React.ReactNode;
    width?: string | number;
    height?: string | number;
  },
  footer?: {
    pageNo: {
      visible: boolean;
      align?: 'right' | 'left' | 'middle'
    },
    title?: string | React.ReactNode;
    logo?: string | React.ReactNode;
    width?: string | number;
    height?: string | number;
  },
  verticalStack?: StackLoader;
  horizontalStack?: StackLoader;
}

export class YamlCardRenderer {
  private config: CardConfig | null = null;
  private error: string | null = null;

  constructor(yamlText: string) {
    this.parseYaml(yamlText);
  }

  private parseYaml(yamlStr: string) {
    try {
      const doc = parseDocument(yamlStr);
      const parsed = doc.toJSON() as CardConfig;
      this.config = parsed;
      this.error = null;
    } catch (err: any) {
      this.config = null;
      this.error = err.message || 'YAML Parse Error';
    }
  }

  public getConfig(): CardConfig | null {
    return this.config;
  }

  public getError(): string | null {
    return this.error;
  }
}