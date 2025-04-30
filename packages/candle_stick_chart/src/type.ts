import {BaseWidgetDataType} from "@hulk/common";
import { CandleStickChartCategory } from "./utils";

type NestedYData = ((number | string)[] | NestedYData)[];

export interface CandleStickChartPropsInterface extends BaseWidgetDataType{
  category?: CandleStickChartCategory;
  xData?: string[];
  yData?: NestedYData;
  amount?: number;
}

const CandleStickChartPropsSchema = {
  category: {
    type: 'string',
    enum: ['Basic', 'Detail', 'LargeScale', 'AxisPointer'],
    required: false
  },
  xData: {
    type: 'array',
    items: {
      type: 'string'
    },
    required: false
  },
  yData: {
    type: 'array',
    required: false,
    items: {
      oneOf: [
        {
          type: 'array',
          items: {
            oneOf: [
              { type: 'number' },
              { type: 'string' }
            ]
          }
        },
        {
          $ref: '#/definitions/NestedYData' // 递归引用自身类型
        }
      ]
    }
  },
  amount: {
    type: 'number',
    required: false
  },
  definitions: {
    NestedYData: {
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'array',
            items: {
              oneOf: [
                { type: 'number' },
                { type: 'string' }
              ]
            }
          },
          {
            $ref: '#/definitions/NestedYData' // 递归定义
          }
        ]
      }
    }
  }
};

export default CandleStickChartPropsSchema;