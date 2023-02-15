async function getData(value) {
    const response = await fetch(
        `http://192.168.15.174:3000/topforeign.dat?exchange=${value}`);
    const data = await response.json();

    data.recordset.sort(function (a, b) {
        return a.total_net_value_foreign - b.total_net_value_foreign;
    });
    const top10 = data.recordset.slice(-10);
    const last10 = data.recordset.slice(0, 10);

    labelstop = [];
    valuestop = [];
    labelslast = [];
    valueslast = [];

    for (i = 0; i < top10.length; i++) {
        labelstop.push(top10[i].ticker);
        valuestop.push(+(top10[i].total_net_value_foreign).toFixed(2));
    }

    for (i = 0; i < last10.length; i++) {
        labelslast.push(last10[i].ticker);
        valueslast.push(+(last10[i].total_net_value_foreign).toFixed(2));
    }

    renderChartSell('Bán', valueslast, '', '#fe0001', labelslast, '#chartSell')
    renderChartBuy('Mua', valuestop, '', '#19d216', labelstop, '#chartBuy')
}

function renderChartSell(name, values, text, color, labels, idChart) {
    var optionsSell = {
        series: [{
            name: name,
            data: values
        }],
        chart: {
            toolbar: {
                show: false,
            },
            type: 'bar',
            fontFamily: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
        },
        title: {
            text: text,
            align: 'center',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        fill: {
            colors: [color]
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: labels,
        },
        yaxis: {
            opposite: true
        }
    };

    var chartSell = new ApexCharts(document.querySelector(idChart), optionsSell);
    chartSell.render();
}

function renderChartBuy(name, values, text, color, labels, idChart) {
    var optionsBuy = {
        series: [{
            name: name,
            data: values.sort(function () {
                return -1;
            })
        }],
        chart: {
            toolbar: {
                show: false,
            },
            type: 'bar',
            fontFamily: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
        },
        title: {
            text: text,
            align: 'center',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        }, fill: {
            colors: [color]
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: labels,
        }
    };
    var chartBuy = new ApexCharts(document.querySelector(idChart), optionsBuy);
    chartBuy.render();
}

function onChangeData() {
    const e = document.getElementById("ddlViewBy");
    getData(`${e.value}`)
}


