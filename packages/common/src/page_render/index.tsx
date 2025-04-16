import { useMemo, useState } from "react";
import React from 'react';
import { SAMPLE_PAGES } from "../page_render/sample";
import { Button, Row } from "antd";

export const PageRender: React.FC<{ yamlText: string }> = ({ yamlText }) => {

  const pages = SAMPLE_PAGES;
  console.log(pages)

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);
  const direction = 'vertical';

  const scrollToPage = (pageId) => {
    const element = document.getElementById(pageId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: direction === 'vertical' ? 'start' : 'nearest',
        inline: direction === 'vertical' ? 'nearest' : 'start'
      });
    }
  };

  // 处理导航按钮点击
  const handleNavClick = (currentPageId, direction) => {
    const currentIndex = pages.findIndex(p => `page_${currentPageId}` === `page_${pages.indexOf(p) + 1}`);
    if (direction === 'prev' && currentIndex > 0) {
      scrollToPage(`page_${currentIndex}`); // 上一页
    } else if (direction === 'next' && currentIndex < pages.length - 1) {
      scrollToPage(`page_${currentIndex + 2}`); // 下一页
    }
  };

  const pageLoader = useMemo(() => {
    return pages.map((page, pageInd) => {
      return <div
        id={`page_${pageInd + 1}`}
        style={{ width: page.width ?? 600, height: page.height ?? 800, border: 'solid black 1px' }}>
        {/* 上一页下一页锚点 */}
        {pageControl && <Row justify={pageInd === 0 ? 'end' : pageInd === (pages.length - 1) ? 'start' : 'space-around'}>
          {pageInd !== 0 && <Button onClick={() => handleNavClick(pageInd + 1, 'prev')}>上一页</Button>}
          {pageInd !== (pages.length - 1) && <Button onClick={() => handleNavClick(pageInd + 1, 'next')}>下一页</Button>}
        </Row>}


        {/* 页面header */}
        {page.header && <div style={{ width: page.header.width ?? 600, height: page.header.height ?? 100 }}>
          <Row justify={'space-around'}>
            <span>{page.header.title}</span>
            <span>{page.header.logo}</span>
          </Row>
        </div>}

        {/* 页面内容 */}
        {page.name}
        
        {/* 页面footer */}
        {page.footer && <div style={{ width: page.footer.width ?? 600, height: page.footer.height ?? 100 }}>
          {(page.footer.title || page.footer.logo) && <Row justify={'space-around'}>
            <span>{page.footer.title}</span>
            <span>{page.footer.logo}</span>
          </Row>}
          {page.footer.pageNo.visible && <Row justify={page.footer.pageNo.align}>{pageInd + 1}</Row>}
        </div>}
      </div>
    })
  }, [])

  return <div>{pageLoader}</div>;
};
