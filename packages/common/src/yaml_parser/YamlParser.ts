import { parseDocument } from 'yaml';
import { Report } from '../../../report_builder/src/type';

export class YamlParser {
  private report: Report | null = null;
  private error: string | null = null;

  constructor({ reportText }: { reportText: string }) {
    this.parseText2Json(reportText);
  }

  private parseText2Json(yamlStr: string) {
    try {
      const doc = parseDocument(yamlStr);
      const parsed = doc.toJSON() as Report;
      this.report = parsed;
      this.error = null;
    } catch (err: any) {
      this.report = null;
      this.error = err.message || 'YAML Parse Error';
    }
  }

  public getReport(): Report | null {
    return this.report;
  }

  public getError(): string | null {
    return this.error;
  }
}