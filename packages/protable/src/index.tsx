import { ActionType, Button, Col, convertOriginDataToRawData, ProColumns, ProTable, React, Row } from '@hulk/common';
import { useProtableCommon } from './context';
import { ProtablePropsInterface } from "./type.ts";
import defaultConfigs from './configs.ts';


const Protable: React.FC = (props: ProtablePropsInterface | {}) => {
  const { widgetData, updateWidgetData, resetWidgetData, triggerAction } = useProtableCommon();

  const { useState, useRef, useEffect, useMemo } = React;

  const data: ProtablePropsInterface = useMemo(() => {
    return {
      //TODO add default props here above ...props
      ...defaultConfigs,
      ...props,
      ...widgetData,
    };
  }, [props, widgetData]);

  // determine isStorybook(Dev) or Production(Built)
  const isStorybook = data.isStorybook ?? false;

  const tableData = convertOriginDataToRawData(data.originData?.rows);

  const { organizedData, xDataName, yDataName } = tableData;
  const actionRef = useRef<ActionType>(null);

  // 如果keepColumnsTogether为true，表示所有列在一页，就不可以column分页
  // 否则判断columnSize是不是比实际的columns少，如果true就是可以column分页
  const canColumnPagination = data.keepColumnsTogether === true ? false : data.columnSize !== undefined && data.columnSize > 0 && data.columnSize < (xDataName.length + yDataName.length);

  const [currentColumnPage, setCurrentColumnPage] = useState<number>(1);
  const [totalColumnPages, setTotalColumnPages] = useState<number>(1);

  const columns: ProColumns[] = useMemo(() => {

    // 如果fixedColumnHeaders为true表示首列可见，那column翻页总页数应该就是yDataName/(columnSize-1),然后当前页是从（currentColumnPage-1)*columnSize到currentColumnPage*columnSize

    // 如果为false表示首列不可见，那column翻页总页数是(xDataName+yDataName)/columnSize，第一页是xDataName+yDataName.slice(0,columnSize-1),后面是（currentColumnPage-1)*columnSize -1到currentColumnPage*columnSize-1
    if (canColumnPagination && data.columnSize !== undefined && data.columnSize > 0) {

      return [
        ...xDataName.map((xD) => {
          return {
            title: xD,
            align: "center" as const,
            dataIndex: xD,
            // 可以做等分
            // width: `${100 / (xDataName.length + yDataName.length)}%`,
            ...(data.fixedColumnHeaders ? { fixed: 'left' } : {}),
            search: false,
            // render: (_, record, ind) => [
            //   <span key={ind}>{JSON.stringify(record).slice(0, 5)}</span>
            // ],
          }
        }).slice(0, data.fixedColumnHeaders ? 1 : currentColumnPage === 1 ? 1 : 0),
        ...yDataName.map((yD) => {
          return {
            title: yD,
            dataIndex: yD,
            align: "center" as const,
            // width: `${100 / (xDataName.length + yDataName.length)}%`,
            search: false
          }
          // 第一页都是从0开始
          // 
        }).slice(data.fixedColumnHeaders ? ((currentColumnPage - 1) * (data.columnSize - 1)) : currentColumnPage === 1 ? 0 : ((currentColumnPage - 1) * data.columnSize - 1), data.fixedColumnHeaders ? (currentColumnPage * (data.columnSize - 1)) : currentColumnPage === 1 ? data.columnSize - 1 : (currentColumnPage * data.columnSize - 1)),

      ]
    }
    return [
      ...xDataName.map((xD) => {
        return {
          title: xD,
          align: "center" as const,
          dataIndex: xD,
          // 可以做等分
          // width: `${100 / (xDataName.length + yDataName.length)}%`,
          ...(data.fixedColumnHeaders ? { fixed: 'left' } : {}),
          search: false,
          // render: (_, record, ind) => [
          //   <span key={ind}>{JSON.stringify(record).slice(0, 5)}</span>
          // ],
        }
      }),
      ...yDataName.map((yD) => {
        return {
          title: yD,
          dataIndex: yD,
          align: "center" as const,
          // width: `${100 / (xDataName.length + yDataName.length)}%`,
          search: false
        }
      }),
    ]

  }, [xDataName, yDataName, data.fixedColumnHeaders, data.columnSize, currentColumnPage]);

  useEffect(() => {
    if (data.columnSize !== undefined && data.columnSize > 0) {
      const temp = data.fixedColumnHeaders ? yDataName.length / (data.columnSize - 1) : (xDataName.length + yDataName.length) / data.columnSize
      setTotalColumnPages(Math.round(temp))

    }
  }, [xDataName, yDataName, data.fixedColumnHeaders, data.columnSize])

  return <Row align="middle">
    <Col span={canColumnPagination && currentColumnPage !== 1 ? 1 : 0}>
      <Button
        style={{
          color: '#1890ff',
          border: 'none',
          backgroundColor: 'none',
        }}
        onClick={async () => {
          setCurrentColumnPage(p => p - 1)
        }}
      >
        {`<`}
      </Button>
    </Col>
    <Col span={canColumnPagination ? 22 : 24}>

      <ProTable
        // 用key来确保在改变这两个设置时protable会更新
        key={`table-${data.fixedColumnHeaders}-${data.fixedRowHeaders}-${data.columnSize}-${currentColumnPage}`}
        className={""}
        showHeader={data.currentPage === 1 ? true : data.repeatRowHeaders}
        scroll={{ x: 'max-content' }}
        headerTitle={data.tableName && data.tableName !== '' ? <span>{data.tableName}</span> : null}
        style={{
          width: data.width,
          height: data.height,
          overflow: 'scroll'
        }}
        actionRef={actionRef}
        onChange={pagination => {
          if (pagination) {
            const { current, pageSize } = pagination;
            if (current && pageSize) {
              updateWidgetData({
                pageSize,
                currentPage: current
              }, isStorybook)
            }
          }
        }}
        pagination={data.pageBreak ? {
          pageSize: data.keepRowsTogether ? data.originData?.rows.length : data.pageSize || 10,
          current: data.currentPage || 1,
          showQuickJumper: true,
          showSizeChanger: true,
          total: data.originData?.rows.length
        } : false}
        dataSource={organizedData}
        sticky={data.fixedRowHeaders ? {
          offsetHeader: data.fixedRowHeaders,
        } : false}
        search={false}
        rowKey="id"
        tableLayout="auto"
        columns={columns}
      // options={false}
      />
    </Col>
    <Col span={canColumnPagination && currentColumnPage !== (totalColumnPages - 1) ? 1 : 0}>
      <Button
        style={{
          color: '#1890ff',
          border: 'none',
          backgroundColor: 'none',
        }}
        onClick={async () => {
          setCurrentColumnPage(p => p + 1)
        }}
      >
        {`>`}
      </Button>
    </Col>
  </Row>
}

export default Protable
