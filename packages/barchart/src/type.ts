import {BaseWidgetDataType} from "@hulk/common";
import { BarChartCategory } from "./utils";

export interface BarchartPropsInterface extends BaseWidgetDataType{
  category?: BarChartCategory;
  legendEnabled?: boolean;
  legendLayout?: 'vertical' | 'horizontal';
  color?: string,
  labelEnabled?: boolean;
  labelPosition?: 'top' | 'inside';
  rawData?: {
    rows: {
      columns: {
        name: string;
        value: string;
      }[];
    }[];
  },
  xColumn?: string,
  yColumns?: string[],
  xData?: string[];
  yData?: {
    name: string;
    data: number[];
  }[];
}

const BarchartPropsSchema = {
  category: {
    type: 'string',
    enum: ['Basic', 'Vertical', 'Radial Polar', 'Tangential Polar', 'Mixed Line', 'Stacked', 'Stacked Horizontal'],
    required: false
  },
  legendEnabled: {
    type: 'boolean',
    required: false
  },
  legendLayout: {
    type: 'string',
    enum: ['vertical', 'horizontal'],
    required: false
  },
  color: {
    type: 'string',
    required: false
  },
  labelEnabled: {
    type: 'boolean',
    required: false
  },
  labelPosition: {
    type: 'string',
    enum: ['top', 'inside'],
    required: false
  },
  rawData: {
    type: 'object',
    required: false,
    properties: {
      rows: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            columns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    required: true
                  },
                  value: {
                    type: 'string',
                    required: true
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  xColumn: {
    type: 'string',
    required: false
  },
  yColumns: {
    type: 'array',
    items: {
      type: 'string'
    },
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
      type: 'object',
      properties: {
        name: {
          type: 'string',
          required: true
        },
        data: {
          type: 'array',
          items: {
            type: 'number'
          },
          required: true
        }
      }
    }
  }
};

export default BarchartPropsSchema
