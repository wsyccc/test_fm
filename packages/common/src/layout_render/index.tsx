// LayoutRender.tsx
import { ReactNode, useMemo } from "react";
import React from 'react';
import { StackType } from "../../type";
import { CardConfig, StackCard } from "../yaml_parser/YamlParser";
import { WidgetStore } from "../yaml_parser/types";
import { BarchartProvider } from "../../../barchart/src/context";
import { WidgetType } from "../../constants";

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

export const LayoutRender: React.FC<{ content: StackCard[], level: number }> = ({ content, level }) => {

  const stackCardRender = useMemo(() => {
    return content.map((child, childInd) => {
      // 如果是horizontal的话，那高度顶满
      if (child.type === StackType.horizontal) {
        const { content: childContent, gap, style } = child;
        return childContent ? <div id={`${child.type}_${level}`} style={{
          height: child.height ?? '100%',
          width: child.width ?? '100%',
          outline: '1px red solid',
          display: 'flex',
          flexDirection: 'row',
          alignItems: child.style?.align ?? 'center',
          flexWrap: 'nowrap',
          gap,
          ...style,
        }}>
          <LayoutRender content={childContent} level={level + 1} />
        </div> : <></>
      }
      if (child.type === StackType.vertical) {
        const { content: childContent, gap, style } = child;

        return childContent ? <div id={`${child.type}_${level}`} style={{
          height: child.height ?? '100%',
          width: child.width ?? '100%',
          outline: '1px #1890ff solid',
          display: 'flex',
          flexDirection: 'column',
          alignItems: child.style?.align ?? 'center',
          flexWrap: 'nowrap',
          gap,
          ...style,
        }}><LayoutRender content={childContent} level={level + 1} /></div> : <></>
      }
      const CachedWidget = WidgetStore.current?.[child.type];

      const configs = {
        width: child.width,
        height: child.height,
        ...child.configs
      }
      // 这里应该return cardLoader
      return <div id={`${child.type}_${level}`
      } style={{
        width: child.width,
        height: child.height,
        flexShrink: 0,
        outline: '1px green solid',

      }}>
        {child.type === WidgetType.barchart ? <BarchartProvider>
          <CachedWidget {...configs} />
        </BarchartProvider>
          : child.type}
      </div>

    })

  }, [content, WidgetStore.current])

  return stackCardRender;
};
