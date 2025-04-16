import { CSSProperties, ReactNode, useMemo, useState } from "react";
const applyStyle = (style?: StyleConfig): CSSProperties => style || {};
import React from 'react';
import { StyleConfig } from "../../type";
import { SAMPLE_PAGES } from "../page_render/sample";

export const PageRender: React.FC<{ yamlText: string }> = ({ yamlText }) => {

  const pages = SAMPLE_PAGES;
  console.log(pages)

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);

  const pageLoader = useMemo(() => {
    return pages.map((page) => {
      return <div style={{ width: page.width ?? 600, height: page.height ?? 800, border: 'solid black 1px' }}>{page.name}</div>
    })
  }, [])

  return <div>{pageLoader}</div>;
};
