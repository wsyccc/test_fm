import type { ComponentType, LazyExoticComponent, RefObject } from 'react';

export const WidgetStore: RefObject<
  Record<string, LazyExoticComponent<ComponentType<Record<string, any>>>>
> = { current: {} };