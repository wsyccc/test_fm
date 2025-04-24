import { v4 as uuidv4 } from "uuid";

export const convertOriginDataToRawData = (
  originData,
  indicateXData?: string, // column名字
  indicateYData?: string[], // column名字组，多个column显示多个线（linechart)
) => {
  const xData: string[] = [];

  const xDataName: string[] = [];
  const yData: { name: string; data: number[]; type: string }[] = [];

  const yDataName: string[] = [];
  const organizedData: any[] = [];
  originData.forEach((item) => {
    const columns = item.columns;

    // 这部分是对原始数据做一个普通转换给table用的，所以完全不考虑数据类型，不考虑这个数据是否能转换成时间戳或者number
    let orgData = {};
    columns.forEach((c: { name: string; value: any }) => {
      orgData = {
        ...orgData,
        [c.name]: c.value
      }
    })
    organizedData.push(orgData);
    let hasTimeStamp = false;

    // 先看有没有指定的xData
    // 再判断有没有时间戳，有的话获取到的第一个时间戳作为xData
    const datetimeRegex =
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC)|(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})|(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})$/;
    if (indicateXData && indicateXData !== '') {
      columns.map((c: { name: string; value: any }) => {
        if (c.name === indicateXData) {
          if (xDataName.includes(c.name)) {
            xData.push(c.value);
          } else if (xDataName.length === 0) {
            xDataName.push(c.name);
            xData.push(c.value);
          }
        }
      });
    } else {
      columns.map((c: { name: string; value: any }) => {
        if (typeof c.value === 'string' && c.value !== null && datetimeRegex.test(c.value)) {
          if (xDataName.includes(c.name)) {
            xData.push(c.value);
          } else if (xDataName.length === 0) {
            xDataName.push(c.name);
            xData.push(c.value);
            hasTimeStamp = true;
          }
        }
      });
    }
    // 首先检查有没有指定y轴数据，如果有的话按顺序提取
    if (indicateYData && indicateYData.length > 0) {
      indicateYData.map((indicateYDataSingle: string) => {
        // 找到name符合指定y轴数据，此时可以插入value
        const c = columns.find((cm) => cm.name === indicateYDataSingle);
        // 非第一个数据，需要找到正确的yData插入
        if (yDataName.includes(c.name)) {
          yData.forEach((yD: { name: string; data: number[]; type: string }) => {
            if (yD.name === c.name) yD.data.push(parseFloat(c.value));
          });
        } else {
          // 第一个数据，需要插入新对象，包括name/data/type
          yData.push({ name: c.name, data: [parseFloat(c.value)], type: 'bar' });
          yDataName.push(c.name);
        }
      });
    }
    columns.map((c: { name: string; value: any }) => {
      // 既没有指定xData，也没有时间戳，就以第一个获取到的字符串column作为xData
      if (typeof c.value === 'string' && c.value !== null && isNaN(parseFloat(c.value))) {
        if (!hasTimeStamp && !(indicateXData && indicateXData !== '')) {
          if (xDataName.includes(c.name)) {
            xData.push(c.value);
          } else if (xDataName.length === 0) {
            xDataName.push(c.name);
            xData.push(c.value);
          }
        }
      } else if (c.value !== null) {
        // 忽略时间戳数据，忽略会变成NaN的数据，注意只有在没有指定yData的情况下才会走到这一步进行所有符合要求数据的插入
        if (
          !datetimeRegex.test(c.value) &&
          !isNaN(parseFloat(c.value)) &&
          (!indicateYData || indicateYData.length === 0)
        ) {
          if (yDataName.includes(c.name)) {
            yData.forEach((yD: { name: string; data: number[]; type: string }) => {
              if (yD.name === c.name) yD.data.push(parseFloat(c.value));
            });
          } else {
            yData.push({ name: c.name, data: [parseFloat(c.value)], type: 'bar' });
            yDataName.push(c.name);
          }
        }
      }
    });
  });

  return { xData, yData, xDataName, yDataName, organizedData };
};


export function toPascalCase(name: string): string {
  return name
    .split(/[_-]/g)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('');
}

export function generateWidgetId(): string {
  return uuidv4();
}