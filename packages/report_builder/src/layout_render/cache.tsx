/// <reference types="vite/client" />
import { WidgetType, toPascalCase, React } from '@hulk/common';
import BarchartPropsSchema from '@packages/barchart/src/configs.schema.json';
import ButtonPropsSchema from '@packages/button/src/configs.schema.json';
import CandleStickChartPropsSchema from '@packages/candle_stick_chart/src/configs.schema.json';
import DynamicBarchartPropsSchema from '@packages/dynamic_barchart/src/configs.schema.json';
import GaugechartPropsSchema from '@packages/gaugechart/src/configs.schema.json';
import GeoChartPropsSchema from '@packages/geo_chart/src/configs.schema.json';
import LineChartPropsSchema from '@packages/linechart/src/configs.schema.json';
import OtherChartsPropsSchema from '@packages/other_charts/src/configs.schema.json';
import ScatterChartPropsSchema from '@packages/scatter_chart/src/configs.schema.json';
import SpeedThreeDPropsSchema from '@packages/speed_three_d/src/configs.schema.json';
import SplitterPropsSchema from '@packages/splitter/src/configs.schema.json';
import SunburstChartPropsSchema from '@packages/sunburst_chart/src/configs.schema.json';
import ThreeDPropsSchema from '@packages/three_d/src/configs.schema.json';
import ThreeDChartPropsSchema from '@packages/three_dchart/src/configs.schema.json';
import TreeMapChartPropsSchema from '@packages/tree_map_chart/src/configs.schema.json';
import ProtablePropsSchema from '@packages/protable/src/configs.schema.json';
import TextPropsSchema from '@packages/text/src/configs.schema.json';
import ImagePropsSchema from '@packages/image/src/configs.schema.json';

type ProvComp = React.ComponentType<{ children: React.ReactNode }>;

type WidgetComp = React.ComponentType<any>;

// 缓存每种类型的 LazyProvider，避免重复创建
const providerCache: Partial<Record<WidgetType, React.LazyExoticComponent<ProvComp>>> = {};

const widgetCache: Partial<Record<WidgetType, React.LazyExoticComponent<WidgetComp>>> = {};

export function getLazyProvider(widgetType: WidgetType): React.LazyExoticComponent<ProvComp> {
  if (!providerCache[widgetType]) {
    providerCache[widgetType] = React.lazy<ProvComp>(() =>
      import(
        `@packages/${widgetType}/src/context.ts`
      ).then(mod => {
        const exportName = `${toPascalCase(widgetType)}Provider`;
        const Provider = (mod as any)[exportName] as ProvComp;
        if (!Provider) {
          throw new Error(`Module @packages/${widgetType}/src/context.ts does not export ${exportName}`);
        }

        return { default: Provider };
      })
    );
  }
  return providerCache[widgetType]!;
}

export function getLazyWidget(widgetType: WidgetType): React.LazyExoticComponent<WidgetComp> {
  if (!widgetCache[widgetType]) {
    widgetCache[widgetType] = React.lazy<WidgetComp>(() =>
      import(
        `@packages/${widgetType}/src/index.tsx`
      ).then(mod => {
        const Component = mod.default as WidgetComp;
        if (!Component) {
          throw new Error(
            `Module @packages/${widgetType}/src/index.tsx has no default export`
          );
        }
        return { default: Component };
      })
    );
  }
  return widgetCache[widgetType]!;
}

const schemaMap: Partial<Record<WidgetType, any>> = {
  barchart: BarchartPropsSchema,
  button: ButtonPropsSchema,
  candle_stick_chart: CandleStickChartPropsSchema,
  dynamic_barchart: DynamicBarchartPropsSchema,
  gaugechart: GaugechartPropsSchema,
  geo_chart: GeoChartPropsSchema,
  linechart: LineChartPropsSchema,
  other_charts: OtherChartsPropsSchema,
  scatter_chart: ScatterChartPropsSchema,
  speed_three_d: SpeedThreeDPropsSchema,
  splitter: SplitterPropsSchema,
  sunburst_chart: SunburstChartPropsSchema,
  three_d: ThreeDPropsSchema,
  three_dchart: ThreeDChartPropsSchema,
  tree_map_chart: TreeMapChartPropsSchema,
  protable: ProtablePropsSchema,
  text: TextPropsSchema,
  image: ImagePropsSchema,
  // ...
};

export default schemaMap;