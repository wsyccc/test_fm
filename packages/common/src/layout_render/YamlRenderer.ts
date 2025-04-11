import { parseDocument } from 'yaml';
import {BaseWidgetConfigType} from "../../type";
import {CSSProperties} from "react";




export interface YamlWidget extends BaseWidgetConfigType {
  style?: StyleConfig;
}


export type CardConfig = YamlWidget | StackCard;

export interface StackCard {
  type: StackType;
  cards: CardConfig[];
  style?: StyleConfig;
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