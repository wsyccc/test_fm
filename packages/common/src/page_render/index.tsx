import { useMemo, useState } from "react";
import React from 'react';
import { SAMPLE_PAGES } from "../page_render/sample";
import { Row } from "antd";

export const PageRender: React.FC<{ yamlText: string }> = ({ yamlText }) => {

  const pages = SAMPLE_PAGES;
  console.log(pages)

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);

  const pageLoader = useMemo(() => {
    return pages.map((page, pageInd) => {
      return <div style={{ width: page.width ?? 600, height: page.height ?? 800, border: 'solid black 1px' }}>
        {page.header && <div style={{ width: page.header.width ?? 600, height: page.header.height ?? 100 }}>
          <Row justify={'space-around'}>
            <span>{page.header.title}</span>
            <span>{page.header.logo}</span>
          </Row>
        </div>}
        {page.name}
        {page.footer && <div style={{ width: page.footer.width ?? 600, height: page.footer.height ?? 100 }}>
          {(page.footer.title || page.footer.logo) && <Row justify={'space-around'}>
            <span>{page.footer.title}</span>
            <span>{page.footer.logo}</span>
          </Row>}
          {page.footer.pageNo.visible && <Row justify={page.footer.pageNo.align}>{pageInd}</Row>}
        </div>}
      </div>
    })
  }, [])

  return <div>{pageLoader}</div>;
};
