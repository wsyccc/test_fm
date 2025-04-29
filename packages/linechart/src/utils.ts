export enum LineChartCategory {
  Basic = "Basic",
  Smoothed = "Smoothed",
  Area = "Area",
  StackedLine = "Stacked Line",
  StackedArea = "Stacked Area",
  Race = "Race",
  Step = "Step",
}

export type LineChartRawDataType = {
  xData: string[];
  yData: {
    name: string;
    data: number[];
    step?: "start" | "middle" | "end"
  }[];
};


export function generateLineChartOption(configs: any, rawData: LineChartRawDataType) {
  const duration = configs.category === LineChartCategory.Race ? 10000 : 0;
  const legend = configs?.legendEnabled
    ? {
      orient: configs.legendLayout,
      textStyle: {
        color: configs.color,
      },
    }
    : null;

  const datasetSource = rawData.xData.map((day: string, index: number) => {
    const row: Record<string, any> = { day };
    rawData.yData.forEach((seriesItem) => {
      row[seriesItem.name] = seriesItem.data[index];
    });
    return row;
  });

  // 2. 构造 series 列表（每个系列绑定自己的列名）
  const series = rawData.yData.map((seriesItem) => ({
    type: "line",
    name: seriesItem.name,
    encode: {
      x: "day",
      y: seriesItem.name,
      label: [seriesItem.name],
      itemName: "day",
      tooltip: [seriesItem.name],
    },
    labelLayout: {
      moveOverlap: "shiftY",
    },
    emphasis: {
      focus: "series",
    },
  }));

  const option = {
    animationDuration: duration,
    xAxis: {
      type: "category",
      position: "bottom",
      data: rawData.xData,
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    ...(configs.category === LineChartCategory.Race ? {
      dataset: [
        {
          id: "dataset_raw",
          source: datasetSource,
        },
      ],
    } : {}),
    legend,
    series: configs.category === LineChartCategory.Race ? series : [
      ...rawData.yData.map((yD) => {
        return {
          ...([LineChartCategory.Area, LineChartCategory.StackedArea].includes(configs.category) ? { areaStyle: {} } : {}),
          ...([LineChartCategory.StackedLine, LineChartCategory.StackedArea].includes(configs.category) ? { stack: "Total" } : {}),
          ...([LineChartCategory.Step].includes(configs.category) ? { step: yD.step } : {}),
          smooth: configs.category === LineChartCategory.Smoothed,
          type: "line",
          name: yD.name || "",
          data: yD.data,
          label: {
            show: configs.labelEnabled,
            position: configs.labelPosition,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        };
      }),
    ],
  };
  return option;
}