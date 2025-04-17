// LayoutRender.tsx

import {CSSProperties, ReactNode, Suspense} from "react";

const applyStyle = (style?: StyleConfig): CSSProperties => style || {};
import React from 'react';
import {StackType, StyleConfig} from "../../type";
import {CardConfig, StackCard} from "../yaml_parser/YamlParser";
import {WidgetType} from "../../constants";
import {getLazyProvider, getLazyWidget} from "./cache";

const renderCard = (card: CardConfig, key?: number): ReactNode => {
  // if (card.type === 'vertical-stack' || card.type === 'horizontal-stack') {
  //   const flexDirection = card.type === 'vertical-stack' ? 'column' : 'row';
  //   const stack = card as StackCard;
  //   return (
  //     <div key={key} style={{ display: 'flex', flexDirection, gap: '8px', ...applyStyle(stack.style) }}>
  //       {stack.cards.map((child, idx) => renderCard(child, idx))}
  //     </div>
  //   );
  // }

  // const base = card as YamlWidget;
  // if (base.type === 'weather-card') {
  //   return (
  //     <div key={key} style={{ border: '1px solid #ccc', padding: '10px', ...applyStyle(base.style) }}>
  //       <strong>🌤 Weather Card</strong>
  //       <div>Entity: {base.entity}</div>
  //     </div>
  //   );
  // }

  // if (base.type === 'gauge-card') {
  //   return (
  //     <div key={key} style={{ border: '1px solid #ccc', padding: '10px', ...applyStyle(base.style) }}>
  //       <strong>🧭 Gauge Card</strong>
  //       <div>Entity: {base.entity}</div>
  //     </div>
  //   );
  // }

  // return <div key={key}>❓ Unknown card type: {base.type}</div>;
  return;
};


export const LayoutRender: React.FC<{ content: StackCard[], level: number }> = ({content, level}) => {
  console.log(content)

  return content.map((child, childInd) => {
    // 如果是horizontal的话，那高度顶满
    if (child.type === StackType.horizontal) {
      const {content: childContent, gap} = child;

      return childContent ? <div id={`${child.type}_${level}`} style={{
        height: 'auto',
        width: 'auto',
        border: '1px red solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap,
      }}>
        <LayoutRender content={childContent} level={level + 1}/>
      </div> : <></>
    }
    if (child.type === StackType.vertical) {
      const {content: childContent, gap} = child;

      return childContent ? <div id={`${child.type}_${level}`} style={{
        height: 'auto',
        width: child.width,
        border: '1px #1890ff solid',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap,

      }}><LayoutRender content={childContent} level={level + 1}/></div> : <></>
    }

    // 拿到对应的 LazyProvider
    const Provider = getLazyProvider(child.type as WidgetType);
    // 拿到已经同步加载好的 widget 组件
    const Widget = getLazyWidget(child.type as WidgetType);


    // 这里应该return cardLoader
    return <div id={`${child.type}_${level}`
    } style={{
      width: child.width,
      height: child.height,
      flexShrink: 0,
      border: '1px green solid',
    }}>
      <Suspense fallback={<div>Loading {child.type}…</div>}>
        <Provider>
          {Widget ? <Widget/> : <div>Widget not found</div>}
        </Provider>
      </Suspense>
    </div>

  })
};
