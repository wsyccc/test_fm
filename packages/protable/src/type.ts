import { BaseWidgetDataType } from "@hulk/common";

export interface ProtablePropsInterface extends BaseWidgetDataType {
  id?: string;
  bgColor?: string;
  // add more props here
  originData?: {
    rows: {
      columns: {
        name: string;
        value: string;
      }[];
    }[];
  },
  // 表格名字
  tableName?: string,
  // 是否显示分页
  pageBreak?: boolean;
  // 每页多少个records
  pageSize?: number,
  // 每页有多少个columns
  columnSize?: number,
  // 当前第几页
  currentPage?: number,
  // 滚动时保持标题行可见，这里用number是让header固定在哪个位置
  fixedRowHeaders?: number,
  // 滚动时保持首列可见
  fixedColumnHeaders?: boolean,
  // 将所有列显示在一页中，true时没有列翻页
  keepColumnsTogether?: boolean;
  // 将所有行显示在一页中，true时没有行翻页，pageBreak=false不生效
  keepRowsTogether?: boolean;
  // 在每一页上重复标题行
  repeatRowHeaders?: boolean;
}