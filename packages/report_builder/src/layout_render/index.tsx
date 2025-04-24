// LayoutRender.tsx
import { getLazyProvider, getLazyWidget } from "./cache";
import {CardConfig, StackType} from "../type.ts";
import { React, WidgetType } from "@hulk/common";

export const LayoutRender: React.FC<{ content: CardConfig[], level: number }> = ({ content, level }) => {

  const {Suspense} = React;

  return content.map((child, childInd) => {
    // 如果是horizontal的话，那高度顶满
    if (child.type === StackType.horizontal) {
      const { content: childContent, gap, style } = child;
      return childContent ? <div
        key={`${child.type}_${level}_${childInd}`}
        id={`${child.type}_${level}_${childInd}`}
        style={{
          height: child.height ?? '100%',
          width: child.width ?? '100%',
          outline: '1px red solid',
          display: 'flex',
          flexDirection: 'row',
          alignItems: style?.align ?? 'center',
          flexWrap: 'nowrap',
          overflow: level === 0 ? "auto" : '',
          gap,
          ...style,
        }}>
        <LayoutRender content={childContent} level={level + 1} />
      </div> : <></>
    }
    if (child.type === StackType.vertical) {
      const { content: childContent, gap, style } = child;

      return childContent ? <div
        key={`${child.type}_${level}_${childInd}`}
        id={`${child.type}_${level}_${childInd}`}
        style={{
          height: 'auto',
          width: child.width,
          border: '1px#18ffd8 solid',
          display: 'flex',
          flexDirection: 'column',
          alignItems: style?.align ?? 'center',
          flexWrap: 'nowrap',
          overflow: level === 0 ? "auto" : '',
          gap,
          ...style

        }}><LayoutRender content={childContent} level={level + 1} /></div> : <></>
    }

    // 拿到对应的 LazyProvider
    const Provider = getLazyProvider(child.type as WidgetType);
    // 拿到已经同步加载好的 widget 组件
    const Widget = getLazyWidget(child.type as WidgetType);

    const { type, ...rest } = child

    return <Suspense
      key={`${type}_${level}_${childInd}`}
      fallback={<div>Loading {type}…</div>}>
      <Provider>
        {Widget ? <Widget {...rest} /> : <div>Widget not found</div>}
      </Provider>
    </Suspense>;

  })
};
