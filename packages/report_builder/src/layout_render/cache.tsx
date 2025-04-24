/// <reference types="vite/client" />
import {WidgetType, toPascalCase, React} from '@hulk/common';

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

        return {default: Provider};
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
        return {default: Component};
      })
    );
  }
  return widgetCache[widgetType]!;
}