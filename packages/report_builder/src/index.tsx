/**
 * Have to use 3rd-party lib from @hulk/common
 *
 * @description
 * 1. use the script
 * ```sh
 * yarn install:lib <lib_name>
 * ```
 * The script will install the lib to @hulk/common
 *
 * 2. add the lib export in @hulk/common/index.ts, remember to use the specific import for 3-rd package you need.
 * ```ts
 * export { Button } from 'antd';
 * ```
 * 3. add the lib import in the component
 * ```ts
 * import { Button } from '@hulk/common';
 * ```
 */
import {React, WidgetType, Row, Button, Col, YamlParser, } from '@hulk/common';
import { useReportBuilderCommon } from './context';
import { ReportBuilderPropsInterface } from "./type.ts";
import defaultConfigs from './configs.ts';
import {getLazyProvider, getLazyWidget} from "./layout_render/cache.tsx";
import {LayoutRender} from "./layout_render";


const MARGIN_CONSTANT = '20px';


const ReportBuilder: React.FC<ReportBuilderPropsInterface> = (props: ReportBuilderPropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction} = useReportBuilderCommon();

  const { useState, useMemo, Suspense } = React;

  const data: ReportBuilderPropsInterface = useMemo(() => {
      return {
        ...defaultConfigs,
        ...props,
        ...widgetData,
      };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  // const isStorybook = data.isStorybook ?? false;

  const renderer = new YamlParser({reportText: data.yamlText});
  const config = renderer.getReport();
  const error = renderer.getError();

  if (error) {
    return <pre style={{ color: 'red' }}>{error}</pre>;
  }

  if (!config) {
    return <div>⚠️ 没有可渲染的内容</div>;
  }

  const { header, footer, pages, orientation } = config;

  const [pageControl, setPageControl] = useState<boolean>(pages.length > 1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // const scrollToPage = (pageId) => {
  //   const element = document.getElementById(pageId);
  //   if (element) {
  //     element.scrollIntoView({
  //       behavior: 'smooth',
  //       block: orientation === 'vertical' ? 'start' : 'nearest',
  //       inline: orientation === 'horizontal' ? 'start' : 'nearest'
  //     });
  //   }
  // };

  // 处理导航按钮点击
  const handleNavClick = (currentPageId: number, orientation: string) => {
    const currentIndex = pages.findIndex(p => `page_${currentPageId}` === `page_${pages.indexOf(p) + 1}`);
    if (orientation === 'prev' && currentIndex > 0) {
      // scrollToPage(`page_${currentIndex}`); // 上一页
      setCurrentPage(p => p - 1);
    } else if (orientation === 'next' && currentIndex < pages.length - 1) {
      // scrollToPage(`page_${currentIndex + 2}`); // 下一页
      setCurrentPage(p => p + 1);
    }
  };

  // 获取header title/subtitle/logo的属性
  const HeaderTitleProvider = getLazyProvider(header?.title?.type as WidgetType);
  const HeaderTitleWidget = getLazyWidget(header?.title?.type as WidgetType);
  const HeaderSubTitleProvider = getLazyProvider(header?.title?.type as WidgetType);
  const HeaderSubTitleWidget = getLazyWidget(header?.title?.type as WidgetType);
  const HeaderLogoProvider = getLazyProvider(header?.logo?.type as WidgetType);
  const HeaderLogoWidget = getLazyWidget(header?.logo?.type as WidgetType);

  // 获取footer title/subtitle的属性
  const FooterTitleProvider = getLazyProvider(footer?.title?.type as WidgetType);
  const FooterTitleWidget = getLazyWidget(footer?.title?.type as WidgetType);
  const FooterSubTitleProvider = getLazyProvider(footer?.title?.type as WidgetType);
  const FooterSubTitleWidget = getLazyWidget(footer?.title?.type as WidgetType);
  const FooterLogoProvider = getLazyProvider(footer?.logo?.type as WidgetType);
  const FooterLogoWidget = getLazyWidget(footer?.logo?.type as WidgetType);

  const pageLoader = useMemo(() => {
    return pages.map((page, pageInd) => {
      // 如果显示控制，那么只显示一页，就是currentPage = pageInd+1
      // 如果不显示控制，那就显示所有页
      const { content } = page;
      console.log(pageInd, content)
      return (pageControl && currentPage === (pageInd + 1) || !pageControl) ? <div
        key={`page_${pageInd + 1}`}
        id={`page_${pageInd + 1}`}
        style={{
          width: page.width ?? "100%",
          height: page.height ?? "100%",
          border: 'solid black 1px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
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


        {/* 页面header */}
        {header && <header style={{
          width: header.width ?? "100%",
          height: header.height ?? "100%",
        }}>
          <Row justify={'space-between'}>
            <Col style={{ marginLeft: MARGIN_CONSTANT }}>
              {header.title && <Suspense
                fallback={<div>Loading {header.title?.type}…</div>}>
                <HeaderTitleProvider>
                  {HeaderTitleWidget ? <HeaderTitleWidget {...header.title} /> : <div>Widget not found</div>}
                </HeaderTitleProvider>
              </Suspense>}
              {header.subtitle && <Suspense
                fallback={<div>Loading {header.subtitle?.type}…</div>}>
                <HeaderSubTitleProvider>
                  {HeaderSubTitleWidget ? <HeaderSubTitleWidget {...header.subtitle} /> : <div>Widget not found</div>}
                </HeaderSubTitleProvider>
              </Suspense>}
            </Col>
            <Col span={11} style={{
              marginRight: MARGIN_CONSTANT,
              display: "flex",
              justifyContent: "end"
            }}>
              {header.logo && <Suspense
                fallback={<div>Loading {header.logo?.type}…</div>}>
                <HeaderLogoProvider>
                  {HeaderLogoWidget ? <HeaderLogoWidget {...header.logo} /> : <div>Widget not found</div>}
                </HeaderLogoProvider>
              </Suspense>}
            </Col>
          </Row>
        </header>}

        {/* 页面内容 */}
        {content && <main style={{ flex: 1 }}><LayoutRender content={content} level={0} /></main>}

        {/* 页面footer */}
        {footer && <footer
          style={{
            width: footer.width ?? "100%",
            height: footer.height ?? "100%",
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div style={{
            flex: 1,
            overflow: 'auto',
            position: 'relative'
          }}>
            {(footer.title || footer.subtitle || footer.logo) && <Row justify={'space-between'}>
              <Col style={{ marginLeft: MARGIN_CONSTANT }}>
                {footer.title && <Suspense
                  fallback={<div>Loading {footer.title?.type}…</div>}>
                  <FooterTitleProvider>
                    {FooterTitleWidget ? <FooterTitleWidget {...footer.title} /> : <div>Widget not found</div>}
                  </FooterTitleProvider>
                </Suspense>}
                {footer.subtitle && <Suspense
                  fallback={<div>Loading {footer.subtitle?.type}…</div>}>
                  <FooterSubTitleProvider>
                    {FooterSubTitleWidget ? <FooterSubTitleWidget {...footer.subtitle} /> : <div>Widget not found</div>}
                  </FooterSubTitleProvider>
                </Suspense>}
              </Col>
              <Col style={{
                marginRight: MARGIN_CONSTANT,
                display: "flex",
                justifyContent: "end"
              }}>
                {footer.logo && <Suspense
                  fallback={<div>Loading {footer.logo?.type}…</div>}>
                  <FooterLogoProvider>
                    {FooterLogoWidget ? <FooterLogoWidget {...footer.logo} /> : <div>Widget not found</div>}
                  </FooterLogoProvider>
                </Suspense>}
              </Col>
            </Row>}
          </div>
          {footer.pageNo.visible &&
            <Row justify={footer.pageNo.align}>
              <Col style={{
                marginBottom: '10px',
                ...(footer.pageNo.align === 'start' ? { marginLeft: '20px' } : footer.pageNo.align === 'end' ? { marginRight: '20px', } : {}),

              }}>
                {pageInd + 1}
              </Col>
            </Row>
          }
        </footer>}
      </div > : null
    })
  }, [pageControl, currentPage, config])

  return <div style={{
    display: orientation === 'horizontal' ? 'flex' : 'block',
    overflowX: orientation === 'horizontal' ? 'auto' : 'visible',
    overflowY: orientation === 'vertical' ? 'auto' : 'visible',
    height: '100%',
    width: '100%',
    scrollSnapType: orientation === 'horizontal' ? 'x mandatory' : 'y mandatory'
  }}>
    {pageLoader}
  </div>;
}

export default ReportBuilder
