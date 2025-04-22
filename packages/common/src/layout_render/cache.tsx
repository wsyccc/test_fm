// widget‑loader.ts
import { lazy, LazyExoticComponent, ComponentType, ReactNode } from 'react';
import { WidgetType } from '../../constants';
import {toPascalCase} from "../../utils";

type ProvComp = ComponentType<{ children: ReactNode }>;

type WidgetComp = ComponentType<any>;

// 缓存每种类型的 LazyProvider，避免重复创建
const providerCache: Partial<Record<WidgetType, LazyExoticComponent<ProvComp>>> = {};

const widgetCache: Partial<Record<WidgetType, LazyExoticComponent<WidgetComp>>> = {};

export function getLazyProvider(widgetType: WidgetType): LazyExoticComponent<ProvComp> {
  if (!providerCache[widgetType]) {
    providerCache[widgetType] = lazy<ProvComp>(() =>
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

export function getLazyWidget(widgetType: WidgetType): LazyExoticComponent<WidgetComp> {
  if (!widgetCache[widgetType]) {
    widgetCache[widgetType] = lazy<WidgetComp>(() =>
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
