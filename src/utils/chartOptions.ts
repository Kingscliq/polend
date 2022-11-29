const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 12 });
export const chartOptions = {
    series: [{
        name: 'TiFi Reflection Reward APY',
        // type: 'area',
        // data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
    }],
    chart: {
        type: 'area',
        height: '300px',
        background: 'transparent',
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: true,
        },
    },
    theme: {
        mode: 'dark',
    },
    // title: {
    //     text: 'TiFi Reflection Reward APY',
    // },
    dataLabels: {
        enabled: false,
    },
    xaxis: {
        type: 'datetime',
        tooltip: {
            enabled: true,
        },
        axisBorder: {
            show: false,
        },
        labels: {
            datetimeUTC: true,
        },
    },
    tooltip: {
        style: {
            fontFamily: 'Poppins',
        },
        x: {
            format: 'dd MMM yyyy',
        },
    },

    yaxis: {
        axisBorder: {
            show: false,
        },
        labels: {
            show: true,
            align: 'right',
            minWidth: 0,
            maxWidth: 200,
            style: {
                colors: [],
                fontSize: '12px',
                fontFamily: 'Poppins',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
            formatter: (value: any) => formatter.format(value),
        },
    },
    markers: {
        size: 0,
        strokeWidth: 1.5,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        shape: 'circle',
        radius: 1,
        hover: {
            size: 2,
        },
    },
    fill: {
        type: 'solid',
        opacity: 0.7,
        gradient: {
            shadeIntensity: 0.4,
            opacityFrom: 1,
            opacityTo: 0.5,
            stops: [30, 100, 100],
        },
    },
    grid: {
        show: true,
        borderColor: 'rgba(255, 255, 255, 0.083)',
        // strokeDashArray: 3,
        position: 'back',
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        width: 1.5,
        dashArray: 0,
    },
};