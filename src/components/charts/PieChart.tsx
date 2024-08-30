import React, { FC } from 'react';
import Chart from 'react-apexcharts';
import useDarkMode from '../../hooks/useDarkMode';

interface IPieProps {
  series: number[];
  labels: string[];
  height?: string;
  labelsPosition?: 'right' | 'bottom'; // Nueva prop para controlar la posición de los labels
}

interface IChartOptions {
  series: number[];
  options: any;
}

const PieChart: FC<IPieProps> = ({ series, labels, height, labelsPosition = 'right' }) => {
  const { isDarkTheme } = useDarkMode()
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
    '#800000', '#808000', '#FF4500', '#32CD32', '#FFD700',
    '#4B0082', '#00CED1', '#FF1493', '#1E90FF', '#FF6347', '#FFFF00'
  ];

  const labelColor = isDarkTheme ? '#FFFFFF' : '#000000';

  const options: IChartOptions = {
    series,
    options: {
      chart: {
        id: 'pie_chart',
        height: height ? height : 380,
        type: 'pie',
        toolbar: {
          show: false,
        },
      },
      labels,
      colors,
      dataLabels: {
        enabled: true,
        style: {
          colors: ['white'] // Color de los labels basado en el tema
        }
      },
      // responsive: [
      //   {
      //     breakpoint: 768,
      //     options: {
      //       legend: {
      //         position: 'bottom'
      //       }
      //     }
      //   },
      //   {
      //     breakpoint: 1048,
      //     options: {
      //       legend: {
      //         position: 'bottom'
      //       }
      //     }
      //   }
      // ],
      legend: {
        position: labelsPosition, // Posición de los labels basada en la nueva prop
        labels: {
          colors: labelColor // Color de las etiquetas de la leyenda basado en el tema
        }
      },
      stroke: {
        curve: 'monotoneCubic',
      },
      markers: {
        size: 0,
      },
      yaxis: {},
    },
  };

  return (
    <Chart
      options={options.options}
      series={options.series}
      type="pie"
      height={options.options.chart.height}
    />
  );
};

export default PieChart;
