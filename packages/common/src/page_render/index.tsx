import { useMemo, useState } from "react";
import React from 'react';
import { SAMPLE_REPORT } from "../page_render/sample";
import { Button, Row } from "antd";

export const PageRender: React.FC<{ yamlText: string }> = ({ yamlText }) => {

  const { header, footer, pages, orientation } = SAMPLE_REPORT;

  console.log(pages)

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);

  const scrollToPage = (pageId) => {
    const element = document.getElementById(pageId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: orientation === 'vertical' ? 'start' : 'nearest',
        inline: orientation === 'horizontal' ? 'start' : 'nearest'
      });
    }
  };

  // 处理导航按钮点击
  const handleNavClick = (currentPageId, orientation) => {
    const currentIndex = pages.findIndex(p => `page_${currentPageId}` === `page_${pages.indexOf(p) + 1}`);
    if (orientation === 'prev' && currentIndex > 0) {
      scrollToPage(`page_${currentIndex}`); // 上一页
    } else if (orientation === 'next' && currentIndex < pages.length - 1) {
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
        {header && <div style={{ width: header.width ?? 600, height: header.height ?? 100 }}>
          <Row justify={'space-around'}>
            <span>{header.title}</span>
            <span>{header.logo}</span>
          </Row>
        </div>}

        {/* 页面内容 */}
        {pageInd}

        {/* 页面footer */}
        {footer && <div style={{ width: footer.width ?? 600, height: footer.height ?? 100 }}>
          {(footer.title || footer.logo) && <Row justify={'space-around'}>
            <span>{footer.title}</span>
            <span>{footer.logo}</span>
          </Row>}
          {footer.pageNo.visible && <Row justify={footer.pageNo.align}>{pageInd + 1}</Row>}
        </div>}
      </div>
    })
  }, [])

  return <div style={{
    display: orientation === 'horizontal' ? 'flex' : 'block',
    overflowX: orientation === 'horizontal' ? 'auto' : 'visible',
    overflowY: orientation === 'vertical' ? 'auto' : 'visible',
    height:'auto',
    width:'auto',
    scrollSnapType: orientation === 'horizontal' ? 'x mandatory' : 'y mandatory'
  }}>
    {pageLoader}
  </div>;
};
