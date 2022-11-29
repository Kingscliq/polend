import React from 'react';
import Chart from 'react-apexcharts';

interface ChartProps {
  type:
    | 'line'
    | 'area'
    | 'bar'
    | 'histogram'
    | 'pie'
    | 'donut'
    | 'radialBar'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'treemap'
    | 'boxPlot'
    | 'candlestick'
    | 'radar'
    | 'polarArea'
    | 'rangeBar'
    | undefined;
  options?: {};
  setOptions?: React.Dispatch<React.SetStateAction<string>> | any; //any type was infered for number values;
  series?: { name: string; data: number[] }[];
  setSeries?: React.Dispatch<React.SetStateAction<string>> | any; //any type was infered for number values;
}
const TifiChart: React.FC<ChartProps> = ({
  type,
  options,
  setOptions,
  series,
  setSeries,
}) => {
  // const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 12 });

  return <Chart options={options as any} series={series} type={type} />;
};

export default TifiChart;
