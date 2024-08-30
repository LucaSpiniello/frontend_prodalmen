import React, { FC, useRef, useEffect } from 'react';
import { IChartOptions } from '../../interface/chart.interface';
import Chart from '../Chart';
import { Document, Page, View, Image, PDFViewer, StyleSheet } from '@react-pdf/renderer';

interface IPieProps {
    series: number[]
    labels: string[]
}

const PieChart: FC<IPieProps> = ({ series, labels }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Renderizar el gráfico en el canvas
        if (chartRef.current) {
            const canvas = chartRef.current;
            const pdfCanvas = document.createElement('canvas');
            pdfCanvas.width = canvas.width;
            pdfCanvas.height = canvas.height;
            const pdfContext = pdfCanvas.getContext('2d');
            pdfContext?.drawImage(canvas, 0, 0);
        }
    }, []);

    const options: IChartOptions = {
        series,
        options: {
            chart: {
                id: 'pie_chart',
                height: 220,
                type: 'pie',
                toolbar: {
                    show: false,
                },
            },
            labels,
            dataLabels: {
                // enabled: true,
            },
            stroke: {
                curve: 'monotoneCubic',
            },
            markers: {
                size: 0,
            },
            xaxis: {
                categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                title: {
                    text: 'Days',
                },
            },
            yaxis: {
                title: {
                    text: 'Views',
                },
            },
        },
    };

    return (
        <Chart
            ref={chartRef}
            series={options.series}
            options={options.options}
            type={options.options.chart?.type}
            height={options.options.chart?.height}
            width={options.options.chart?.width}
        />
    );
};

export default PieChart;
