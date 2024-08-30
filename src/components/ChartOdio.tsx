// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const ChartComponent = ({ detallesProcesamiento }) => {
//   const series = [
//     {
//       name: "Kilos Procesados",
//       data: detallesProcesamiento.map(item => ({
//         x: new Date(item.hora_procesado).toLocaleTimeString(),
//         y: item.kilos
//       })),
//       type: 'line'
//     },
//     {
//       name: "Eficiencia",
//       data: detallesProcesamiento.map(item => ({
//         x: new Date(item.hora_procesado).toLocaleTimeString(),
//         y: item.eficiencia
//       })),
//       type: 'line'
//     }
//   ];

//   const options = {
//     chart: {
//       height: 350,
//       type: 'line',
//       toolbar: {
//         show: true,
//       },
//       zoom: {
//         enabled: false
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       curve: 'smooth'
//     },
//     title: {
//       text: 'Detalles de Procesamiento',
//       align: 'left'
//     },
//     grid: {
//       borderColor: '#e7e7e7',
//       row: {
//         colors: ['#f3f3f3', 'transparent'],
//         opacity: 0.5
//       },
//     },
//     markers: {
//       size: 5
//     },
//     xaxis: {
//       type: 'category',
//       tickAmount: 10,
//       labels: {
//         formatter: function(value) {
//           return new Date(value).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
//         }
//       }
//     },
//     yaxis: [
//       {
//         title: {
//           text: 'Kilos Procesados',
//         },
//       },
//       {
//         opposite: true,
//         title: {
//           text: 'Eficiencia (%)'
//         }
//       }
//     ],
//     tooltip: {
//       shared: true,
//       intersect: false,
//       x: {
//         show: true
//       }
//     }
//   };

//   return (
//     <ReactApexChart options={options} series={series} type="line" height={350} />
//   );
// };

// export default ChartComponent;