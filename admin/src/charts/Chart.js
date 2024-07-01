import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ series, colors, labels, chartTitle }) => {
  const [chartOptions, setChartOptions] = useState({
    series: series,
    colors: colors,
    chart: {
      height: 320,
      width: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
            },
            total: {
              showAlways: true,
              show: true,
              label: chartTitle,
              fontFamily: "Inter, sans-serif",
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return sum + " kg";
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              formatter: function (value) {
                return value + " kg";
              },
            },
          },
          size: "80%",
        },
      },
    },
    grid: {
      padding: {
        top: -2,
      },
    },
    labels: labels.slice(0, series.length),
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: "bottom",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value + " kg";
        },
      },
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return value + " kg";
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
   
  });

  useEffect(() => {
    const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]');

    function handleCheckboxChange(event) {
      const checkbox = event.target;
      if (checkbox.checked) {
        switch (checkbox.value) {
          case 'desktop':
            setChartOptions({ ...chartOptions, series: [15.1, 22.5, 4.4, 8.4] });
            break;
          case 'tablet':
            setChartOptions({ ...chartOptions, series: [25.1, 26.5, 1.4, 3.4] });
            break;
          case 'mobile':
            setChartOptions({ ...chartOptions, series: [45.1, 27.5, 8.4, 2.4] });
            break;
          default:
            setChartOptions({ ...chartOptions, series: [55.1, 28.5, 1.4, 5.4] });
        }
      } else {
        setChartOptions({ ...chartOptions, series: [35.1, 23.5, 2.4, 5.4] });
      }
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });

    return () => {
      checkboxes.forEach((checkbox) => {
        checkbox.removeEventListener('change', handleCheckboxChange);
      });
    };
  }, [chartOptions]);

  return (
    <div id="donut-chart">
      <Chart options={chartOptions} series={chartOptions.series} type="donut" height={chartOptions.chart.height} />
    </div>
  );
};

export default DonutChart;
