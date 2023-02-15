function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

async function getLichSuKien() {
    const response = await fetch(
        'http://192.168.15.174:3000/lichsukien.dat');
    const data = await response.json();

    var d = document.getElementById("myLichSuKien");
    if (d !== null) {
        let h = "";
        for (let i = 0; i < data.recordset.length; i++)
            h += `
                        <tr id="row${data.recordset[i].ticker}">
                            <td>${data.recordset[i].ticker}</td>
                            <td>${data.recordset[i].LoaiSuKien}</td> 
                            <td>${formatDate(new Date(Date.parse(data.recordset[i].NgayDKCC)))}</td>
                            <td>${data.recordset[i].NoiDungSuKien}%</td>
                        </tr>
                    `
        d.innerHTML = h;
    }

    let d2 = document.getElementById("mySpinner");
    d2.style.display = "none";
}

function convertDate(d) {
    var p = d.split("/");
    return +(p[2] + p[1] + p[0]);
}

function sortByDateDescending() {
    var tbody = document.getElementById("myLichSuKien");
    // get trs as array for ease of use
    var rows = [].slice.call(tbody.querySelectorAll("tr"));

    rows.sort(function (a, b) {
        return convertDate(b.cells[2].innerHTML) - convertDate(a.cells[2].innerHTML);
    });

    rows.forEach(function (v) {
        tbody.appendChild(v); // note that .appendChild() *moves* elements
    });
}

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

async function updateData(value) {
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
}

function onChangeData() {
    const e = document.getElementById("ddlViewBy");
    getData(`${e.value}`)
}

async function getData2() {
    const response = await fetch(`http://192.168.15.174:3000/topforeign.dat?exchange=HSX`);
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

    var optionsSell = {
        series: [{
            name: "Bán",
            data: valueslast
        }],
        chart: {
            toolbar: {
                show: false,
            },
            type: 'bar',
            fontFamily: 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
        },
        title: {
            text: "TOP 10 CỔ PHIẾU KHỐI NGOẠI BÁN NHIỀU NHẤT SÀN HSX QUA 05 PHIÊN GẦN NHẤT",
            align: 'center',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        fill: {
            colors: ['#fe0001']
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: labelslast,
        },
        yaxis: {
            opposite: true
        }
    };

    var chartSell = new ApexCharts(document.querySelector("#chartSell2"), optionsSell);
    chartSell.render();

    var optionsBuy = {
        series: [{
            name: "Mua",
            data: valuestop.sort(function () {
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
            text: "TOP 10 CỔ PHIẾU TĂNG MẠNH NHẤT SÀN HSX QUA 05 PHIÊN GẦN ĐÂY",
            align: 'center',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        }, fill: {
            colors: ['#19d216']
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: labelstop,
        }
    };

    var chartBuy = new ApexCharts(document.querySelector("#chartBuy2"), optionsBuy);
    chartBuy.render();
}


