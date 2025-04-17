import { useEffect, useMemo, useState } from "react";
import React from 'react';
import { SAMPLE_REPORT } from "../page_render/sample";
import { Button, Col, Row } from "antd";
import { LayoutRender } from "../layout_render";
import { YamlParser } from "../yaml_parser/YamlParser";

import { WidgetType } from "../../constants";
import { WidgetStore } from "../yaml_parser/types";

const MARGIN_CONSTANT = '20px';

async function loadConfigStore() {
  for (const type of Object.values(WidgetType)) {
    if (!WidgetStore.current[type]) {
      try {
        WidgetStore.current[type] = (
          await import(`@/packages/${type}/src/index.tsx`)
        ).default;
      } catch (e) {
        console.error(e);
      }
    }
  }
}


export const PageRender: React.FC<{ yamlText: string }> = ({ yamlText }) => {


  // const renderer = new YamlParser(yamlText);
  // const config = renderer.getConfig();
  // const error = renderer.getError();

  // if (error) {
  //   return <pre style={{ color: 'red' }}>{error}</pre>;
  // }

  // if (!config) {
  //   return <div>⚠️ 没有可渲染的内容</div>;
  // }

  const { header, footer, pages, orientation } = SAMPLE_REPORT;

  console.log(pages)

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

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
      // scrollToPage(`page_${currentIndex}`); // 上一页
      setCurrentPage(p => p - 1);
    } else if (orientation === 'next' && currentIndex < pages.length - 1) {
      // scrollToPage(`page_${currentIndex + 2}`); // 下一页
      setCurrentPage(p => p + 1);
    }
  };

  const pageLoader = useMemo(() => {
    return !loading && pages.map((page, pageInd) => {
      // 如果显示控制，那么只显示一页，就是currentPage = pageInd+1
      // 如果不显示控制，那就显示所有页
      const { content } = page;
      return (pageControl && currentPage === (pageInd + 1) || !pageControl) ? <div
        id={`page_${pageInd + 1}`}
        style={{
          width: page.width ?? 600,
          height: page.height ?? 800,
          border: 'solid black 1px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
        {/* 上一页下一页锚点 */}
        <Row justify={'space-between'}>
          <Button
            style={{
              visibility: pageInd !== 0 && pageControl ? 'visible' : 'hidden',
              marginLeft: MARGIN_CONSTANT
            }}
            onClick={() => handleNavClick(pageInd + 1, 'prev')}>上一页</Button>
          <Button onClick={() => setPageControl(p => !p)}>{pageControl ? '隐藏控制' : '显示控制'}</Button>
          <Button
            style={{ visibility: pageInd !== (pages.length - 1) && pageControl ? 'visible' : 'hidden' }}

            onClick={() => handleNavClick(pageInd + 1, 'next')}>下一页</Button>
        </Row>

        <div style={{
          flex: 1,  // 占据剩余所有空间
          overflow: 'auto', // 内容超出时滚动
          position: 'relative'
        }}>
          {/* 页面header */}
          {header && <div style={{ width: header.width ?? 600, height: header.height ?? 100 }}>
            <Row justify={'space-between'}>
              <Col style={{ marginLeft: MARGIN_CONSTANT }}>
                <h2 style={{ width: "100%" }}>{header.title}</h2>
                {header.subtitle && <h4 style={{ width: "100%" }}>{header.subtitle}</h4>}
              </Col>
              <Col span={11} style={{ marginRight: MARGIN_CONSTANT }}>
                <span>{header.logo}</span>
                <span>现在horizontal排列用红色border，vertical用蓝色border，单独组件用绿色border</span>
              </Col>
            </Row>
          </div>}

          {/* 页面内容 */}
          {content && <LayoutRender content={content} level={0} />}
        </div>

        {/* 页面footer */}
        {footer && <div
          style={{
            width: footer.width ?? 600,
            height: footer.height ?? 100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
          <div style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative'
          }}>
            {(footer.title || footer.subtitle || footer.logo) && <Row justify={'space-between'}>
              <Col style={{ marginLeft: MARGIN_CONSTANT }}>
                {footer.subtitle && <h2 style={{ width: "100%" }}>{footer.title}</h2>}
                {footer.subtitle && <h4 style={{ width: "100%" }}>{footer.subtitle}</h4>}
              </Col>
              <Col style={{ marginRight: MARGIN_CONSTANT }}>
                <span>{footer.logo}</span>
              </Col>
            </Row>}
          </div>
          {footer.pageNo.visible &&
            <Row justify={footer.pageNo.align}>
              <Col style={
                (footer.pageNo.align === 'start' ? { marginLeft: '20px' } : footer.pageNo.align === 'end' ? { marginRight: '20px', marginBottom: '10px' } : {})
              }>
                {pageInd + 1}
              </Col>
            </Row>}
        </div>}
      </div > : null
    })
  }, [pageControl, currentPage, loading])

  useEffect(() => {
    async function initProject() {
      setLoading(true)
      await loadConfigStore();
    }

    initProject().then(() => {
      setLoading(false);
    });

    // 清理函数
    return () => { };
  }, []);

  return <div style={{
    display: orientation === 'horizontal' ? 'flex' : 'block',
    overflowX: orientation === 'horizontal' ? 'auto' : 'visible',
    overflowY: orientation === 'vertical' ? 'auto' : 'visible',
    height: 'auto',
    width: 'auto',
    scrollSnapType: orientation === 'horizontal' ? 'x mandatory' : 'y mandatory'
  }}>
    {pageLoader}
  </div>;
};
