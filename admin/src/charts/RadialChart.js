import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import orderDetails from '../data/orderDetails';







const RadialChart = ({ type, data }) => {

 

  const [chartOptions, setChartOptions] = useState({
    series: data,
    colors: [ "#FFD966" , "#66CCCC",   "#FF6B6B"],
    chart: {
      height: 320,
      width: "100%",
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontFamily: "Inter, sans-serif",
            offsetY: 20,
          },
          value: {
            fontFamily: "Inter, sans-serif",
            offsetY: -20,
            formatter: function (val) {
              return val;
            }
          }
        }
      }
    },
    labels: ["Pending", "Delivered", "Cancelled"],
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
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
  }, []);

  return (
    <div id="radial-chart">
      <Chart options={chartOptions} series={chartOptions.series} type="radialBar" height={chartOptions.chart.height} width={"300px"}/>
    </div>
  );
};

export default RadialChart;
