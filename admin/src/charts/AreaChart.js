import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const AreaChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Total Sales",
        data: []
      },
    ],
    colors: ["#16BDCA"],
    chart: {
      height: 280,
      type: "area",
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      show: false
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          cssClass: 'text-xs font-medium fill-gray-500 dark:fill-gray-400'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(2)
        },
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          cssClass: 'text-xs font-medium fill-gray-500 dark:fill-gray-400'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false,
      position: "bottom",
      fontFamily: "Inter, sans-serif"
    }
  });

  useEffect(() => {
    setChartOptions(prevOptions => ({
      ...prevOptions,
      series: [
        {
          name: "Total Sales",
          data: data.map(item => item.value)
        }
      ],
      xaxis: {
        ...prevOptions.xaxis,
        categories: data.map(item => item.date)
      }
    }));
  }, [data]);

  return (
    <div id="area-chart" className='mt-8 ml-4'>
      <Chart options={chartOptions} series={chartOptions.series} type="area" height={chartOptions.chart.height} width={"100%"} />
    </div>
  );
};

export default AreaChart;
