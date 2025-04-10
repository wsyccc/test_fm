// YamlPreviewer.tsx
import React from 'react';
import {CardConfig, StackCard, StyleConfig, YamlWidget} from "./YamlRenderer";
const applyStyle = (style?: StyleConfig): React.CSSProperties => style || {};

const renderCard = (card: CardConfig, key?: number): React.ReactNode => {
  if (card.type === 'vertical-stack' || card.type === 'horizontal-stack') {
    const flexDirection = card.type === 'vertical-stack' ? 'column' : 'row';
    const stack = card as StackCard;
    return (
      <div key={key} style={{ display: 'flex', flexDirection, gap: '8px', ...applyStyle(stack.style) }}>
        {stack.cards.map((child, idx) => renderCard(child, idx))}
      </div>
    );
  }

  const base = card as YamlWidget;
  if (base.type === 'weather-card') {
    return (
      <div key={key} style={{ border: '1px solid #ccc', padding: '10px', ...applyStyle(base.style) }}>
        <strong>🌤 Weather Card</strong>
        <div>Entity: {base.entity}</div>
      </div>
    );
  }

  if (base.type === 'gauge-card') {
    return (
      <div key={key} style={{ border: '1px solid #ccc', padding: '10px', ...applyStyle(base.style) }}>
        <strong>🧭 Gauge Card</strong>
        <div>Entity: {base.entity}</div>
      </div>
    );
  }

  return <div key={key}>❓ Unknown card type: {base.type}</div>;
};

export const YamlPreviewer: React.FC<{ yamlText: string }> = ({ yamlText }) => {
  const renderer = new YamlCardRenderer(yamlText);
  const config = renderer.getConfig();
  const error = renderer.getError();

  if (error) {
    return <pre style={{ color: 'red' }}>{error}</pre>;
  }

  if (!config) {
    return <div>⚠️ 没有可渲染的内容</div>;
  }

  return <div>{renderCard(config)}</div>;
};
