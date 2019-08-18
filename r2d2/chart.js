// Load google chart packages
google.charts.load('current', {'packages': ['corechart', 'line', 'gauge']});

// Calls function when the packages are correctly loaded
google.charts.setOnLoadCallback(drawCharts);

var linedata; //variable for line chart data
var linechart;  //variable for line chart
var lineoptions; //variable for lie option
var radar1;
var radar2;
var radar3;
var radar4;

var rdrLbl = ['Health', 'Economy', 'Infra', 'Leadership'];
var rdrBgColr = [
    window.chartColors.red,
    window.chartColors.blue,
    window.chartColors.yellow,
    window.chartColors.green,
];

var dataRdr1 = [89, 54, 67, 96];
var dataRdr2 = [56, 67, 81, 91];
var dataRdr3 = [78, 90, 82, 86];

var rdrOption = {
    labels: {fontColor: window.chartColors.red},
    legend: {position: 'left'},
    title: {display: true, text: 'Radar Analysis'},
    scale: {ticks: {beginAtZero: true}}
}

var rdrOption1 = {
    labels: {fontColor: window.chartColors.red},
    legend: {position: 'none'},
    title: {display: false, text: 'Radar Analysis'},
    scale: {ticks: {beginAtZero: true}}
}

//radar chart
var color = Chart.helpers.color
var radarConfig = {
    type: 'polarArea',
    data: {
        labels: rdrLbl,
        datasets: [{
            label: '2017',
            backgroundColor: rdrBgColr,
            textStyle: window.chartColors.white,
            data: dataRdr1
        }]
    },
    options: rdrOption
};

//Draws initial graphs
function drawCharts() {
    // Creates the initial data for the line graph
    linedata = google.visualization.arrayToDataTable([
        ['Year', 'Score'],
        ['2014', 0],
        ['2015', 0],
        ['2016', 0],
        ['2017', 0],
        ['2018', 0]
    ]);

    var options = {
        title: 'Reselient Score',
        vAxis: {maxValue: 100, textStyle: {color: '#FFF'}},
        hAxis: {
            textStyle: {color: '#FFF'}
        },
        height: 400,
        width: 800,
        lineColor: "red",
        backgroundColor: {
            fill: '#00000',
            fillOpacity: 0.1
        },
        legend: 'none',
        series: {
            0: {color: '#e2431e'},
            1: {color: '#e7711b'},
            2: {color: '#f1ca3a'},
            3: {color: '#6f9654'},
            4: {color: '#1c91c0'},
            5: {color: '#43459d'},
        }
    };
    //Instantiates the line chart and the location
    linechart = new google.visualization.LineChart(document.getElementById('dvLineChart'));
    //Draws the line chart
    linechart.draw(linedata, options);

    //radar1 = new Chart(document.getElementById('rdr1'), radarConfig);
}

//Update Linear chart
function updateLineChart(result, type) {

    var data = result;
    var d1 = {};
    d1.score = 0;
    var d2 = {}
    d2.score = 0;
    var d3 = {};
    d3.score = 0;

    if (data[0] !== null && data[0] !== undefined) {
        if (type === "D1") {
            d1.year = data[0].Year;
            d1.month = data[0].Month;
            d1.score = data[0].SuburbIndex;
            d1.label = data[0].Date;
        }
        else if (type === "M1") {
            d1.year = data[0]._id.Year;
            d1.month = Number(data[0]._id.Month);
            d1.score = data[0].AggAvg;
            d1.label = month[d1.month] +"-"+ d1.year;

        }
        else if (type === "Q1") {
            d1.year = data[0]._id.Year;
            d1.quarter = Number(data[0]._id.Quarter);
            d1.score = data[0].AggAvg;
            d1.label = Qrtr[d1.quarter-1] +"-"+ d1.year;

        }
        else {
            d1.year = data[0]._id.Year;
            d1.score = data[0].AggAvg;
            d1.label = d1.year;

        }

    }
    if (data[1] !== null && data[1] !== undefined) {
        if (type === "D1") {
            d2.year = data[1].Year;
            d2.month = data[1].Month;
            d2.score = data[1].SuburbIndex;
            d2.label = data[1].Date;
        }
        else if (type === "M1") {
            d2.year = data[1]._id.Year;
            d2.month = Number(data[1]._id.Month);
            d2.score = data[1].AggAvg;
            d2.label = month[d2.month] +"-"+ d2.year;

        }
        else if (type === "Q1") {
            d2.year = data[1]._id.Year;
            d2.quarter = Number(data[1]._id.Quarter);
            d2.score = data[1].AggAvg;
            d2.label = Qrtr[d2.quarter - 1] +"-"+ d2.year;

        }
        else {
            d2.year = data[1]._id.Year;
            d2.score = data[1].AggAvg;
            d2.label = d2.year;

        }


    }
    if (data[2] !== null && data[2] !== undefined) {
        if (type === "D1") {
            d3.year = data[2].Year;
            d3.month = data[2].Month;
            d3.score = data[2].SuburbIndex;
            d3.label = data[2].Date;
        }
        else if (type === "M1") {
            d3.year = data[2]._id.Year;
            d3.month = Number(data[2]._id.Month);
            d3.score = data[2].AggAvg;
            d3.label = month[d3.month] +"-"+ d3.year;

        }
        else if (type === "Q1") {
            d3.year = data[2]._id.Year;
            d3.quarter = Number(data[2]._id.Quarter);
            d3.score = data[2].AggAvg;
            d3.label = Qrtr[d3.quarter -1] +"-"+ d3.year;

        }
        else {
            d3.year = data[2]._id.Year;
            d3.score = data[2].AggAvg;
            d3.label = d3.year;

        }


    }


    // Creates the initial data for the line graph
    linedata = google.visualization.arrayToDataTable([
        ['Year', 'Score'],
        [d1.label, Number(d1.score)],
        [d2.label, Number(d2.score)],
        [d3.label, Number(d3.score)]

    ]);

    var options = {
        title: 'Reselient Score',
        vAxis: {maxValue: 100, textStyle: {color: '#FFF'}},
        hAxis: {
            textStyle: {color: '#FFF'}
        },
        height: 400,
        width: 800,
        lineColor: "red",
        backgroundColor: {
            fill: '#00000',
            fillOpacity: 0.1
        },
        legend: 'none',
        series: {
            0: {color: '#e2431e'},
            1: {color: '#e7711b'},
            2: {color: '#f1ca3a'},
            3: {color: '#6f9654'},
            4: {color: '#1c91c0'},
            5: {color: '#43459d'},
        }
    };
    //Instantiates the line chart and the location
    linechart = new google.visualization.LineChart(document.getElementById('dvLineChart'));
    //Draws the line chart
    linechart.draw(linedata, options);

}

//Update Radar chart
function updateRadarChart(result, type) {
    var datardr = [];
    datardr = result;
    var d1 = {}, d2 = {}, d3 = {};

    var readyData = prepareRdrData(datardr, d1, d2, d3, type);
    d1 = readyData[0];
    d2 = readyData[1];
    d3 = readyData[2];

    var config1 = {
        type: 'radar',
        data: {
            labels: rdrLbl,
            datasets: [{
                label: d1.label,
                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                borderColor: window.chartColors.red,
                pointBackgroundColor: window.chartColors.red,
                data: [
                    d1.hw,
                    d1.es,
                    d1.ie,
                    d1.ls
                ]
            },
                {
                    label: d2.label,
                    backgroundColor: color(window.chartColors.black).alpha(0.2).rgbString(),
                    borderColor: window.chartColors.blue,
                    pointBackgroundColor: window.chartColors.blue,
                    data: [
                        d2.hw,
                        d2.es,
                        d2.ie,
                        d2.ls
                    ]
                },
                {
                    label: d3.label,
                    backgroundColor: color(window.chartColors.green).alpha(0.2).rgbString(),
                    borderColor: window.chartColors.blue,
                    pointBackgroundColor: window.chartColors.blue,
                    data: [
                        d3.hw,
                        d3.es,
                        d3.ie,
                        d3.ls
                    ]
                }
            ]
        },
        options: rdrOption
    };


    var config2 = {
        type: 'radar',
        data: {
            labels: rdrLbl,
            datasets: [{
                label: d1.label,
                backgroundColor: color(window.chartColors.green).alpha(0.2).rgbString(),
                borderColor: window.chartColors.blue,
                pointBackgroundColor: window.chartColors.blue,
                data: [
                    d1.hw,
                    d1.es,
                    d1.ie,
                    d1.ls
                ]
            }
            ]
        },
        options: rdrOption1
    };

    var config3 = {
        type: 'radar',
        data: {
            labels: rdrLbl,
            datasets: [{
                label: d2.label,
                backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
                borderColor: window.chartColors.blue,
                pointBackgroundColor: window.chartColors.blue,
                data: [
                    d2.hw,
                    d2.es,
                    d2.ie,
                    d2.ls
                ]
            }
            ]
        },
        options: rdrOption1
    };

    var config4 = {
        type: 'radar',
        data: {
            labels: rdrLbl,
            datasets: [{
                label: d3.label,
                backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
                borderColor: window.chartColors.blue,
                pointBackgroundColor: window.chartColors.blue,
                data: [
                    d3.hw,
                    d3.es,
                    d3.ie,
                    d3.ls
                ]
            }
            ]
        },
        options: rdrOption1
    };


    radar1 = new Chart(document.getElementById('rdr1'), config1);
    radar2 = new Chart(document.getElementById('rdr2'), config2);
    radar3 = new Chart(document.getElementById('rdr3'), config3);
    radar4 = new Chart(document.getElementById('rdr4'), config4);


}

//Prepare data for Radar Chart
function prepareRdrData(data, d1, d2, d3, type) {
    var datardr = data;
    var output = [];

    if (datardr[0] !== null && datardr[0] !== undefined) {
        var d1DimData = datardr[0].SuburbResiliencyCategories;
    }
    if (datardr[1] !== null && datardr[1] !== undefined) {
        var d2DimData = datardr[1].SuburbResiliencyCategories;
    }
    if (datardr[2] !== null && datardr[2] !== undefined) {
        var d3DimData = datardr[2].SuburbResiliencyCategories;
    }


    if (datardr[0] !== null && datardr[0] !== undefined) {
        if (type === "D1") {
            d1.year = datardr[0].Year;
            d1.month = datardr[0].Month;
            d1.label = datardr[0].Date;
            d1.score = datardr[0].SuburbIndex
        }
        else if (type === "M1") {
            d1.year = datardr[0]._id.Year;
            d1.month = Number(datardr[0]._id.Month);
            d1.score = datardr[0]._id.AggAvg;
            d1.label = month[d1.month] + "-" + d1.year;
        }
        else if (type === "Q1") {
            d1.year = datardr[0]._id.Year;
            d1.score = datardr[0]._id.AggAvg;
            d1.quarter = Number(datardr[0]._id.Quarter);
            d1.label = d1.year + "-" + Qrtr[d1.quarter - 1];
        }
        else {
            d1.year = datardr[0]._id.Year;
            d1.score = datardr[0]._id.AggAvg;
            d1.label = d1.year;
        }

        d1.hw = 0;
        d1.es = 0;
        d1.ie = 0;
        d1.ls = 0;
    }
    if (datardr[1] !== null && datardr[1] !== undefined) {
        if (type === "D1") {
            d2.year = datardr[1].Year;
            d2.month = datardr[1].Month;
            d2.label = datardr[1].Date;
            d2.score = datardr[1].SuburbIndex
        }
        else if (type === "M1") {
            d2.year = datardr[1]._id.Year;
            d2.month = Number(datardr[1]._id.Month);
            d2.score = datardr[1]._id.AggAvg;
            d2.label = month[d2.month] + "-" + d2.year;
        }
        else if (type === "Q1") {
            d2.year = datardr[1]._id.Year;
            d2.score = datardr[1]._id.AggAvg;
            d2.quarter = Number(datardr[1]._id.Quarter);
            d2.label = d2.year + "-" + Qrtr[d2.quarter - 1];
        }
        else {
            d2.year = datardr[1]._id.Year;
            d2.score = datardr[1]._id.AggAvg;
            d2.label = d2.year;
        }

        d2.hw = 0;
        d2.es = 0;
        d2.ie = 0;
        d2.ls = 0;
    }
    if (datardr[2] !== null && datardr[2] !== undefined) {
        if (type === "D1") {
            d3.year = datardr[2].Year;
            d3.month = datardr[2].Month;
            d3.label = datardr[2].Date;
            d3.score = datardr[2].SuburbIndex
        }
        else if (type === "M1") {
            d3.year = datardr[2]._id.Year;
            d3.month = Number(datardr[2]._id.Month);
            d3.score = datardr[2]._id.AggAvg;
            d3.label = month[d3.month] + "-" + d3.year;
        }
        else if (type === "Q1") {
            d3.year = datardr[2]._id.Year;
            d3.score = datardr[2]._id.AggAvg;
            d3.quarter = Number(datardr[2]._id.Quarter);
            d3.label = d3.year + "-" + Qrtr[d3.quarter - 1];
        }
        else {
            d3.year = datardr[2]._id.Year;
            d3.score = datardr[2]._id.AggAvg;
            d3.label = d3.year;
        }

        d3.hw = 0;
        d3.es = 0;
        d3.ie = 0;
        d3.ls = 0;
    }

    //for dataset 1
    if (d1DimData !== null && d1DimData !== undefined) {
        for (var obj in d1DimData) {

            if (d1DimData[obj] !== null && d1DimData[obj].CategoryName === ResilienceCat.HW) {
                console.log(d1DimData[obj].CategoryScore);
                d1.hw = d1DimData[obj].CategoryScore;
            }
            else if (d1DimData[obj] !== null && d1DimData[obj].CategoryName === ResilienceCat.ES) {
                console.log(d1DimData[obj].CategoryScore);
                d1.es = d1DimData[obj].CategoryScore;
            }
            else if (d1DimData[obj] !== null && d1DimData[obj].CategoryName === ResilienceCat.IE) {
                console.log(d1DimData[obj].CategoryScore);
                d1.ie = d1DimData[obj].CategoryScore;
            }
            else if (d1DimData[obj] !== null && d1DimData[obj].CategoryName === ResilienceCat.LS) {
                console.log(d1DimData[obj].CategoryScore);
                d1.ls = d1DimData[obj].CategoryScore;
            }
            else {

            }
        }
    }

    //for dataset 2
    if (d2DimData !== null && d2DimData !== undefined) {
        for (var obj in d2DimData) {

            if (d2DimData[obj] !== null && d2DimData[obj].CategoryName === ResilienceCat.HW) {
                console.log(d1DimData[obj].CategoryScore);
                d2.hw = d2DimData[obj].CategoryScore;
            }
            else if (d2DimData[obj] !== null && d2DimData[obj].CategoryName === ResilienceCat.ES) {
                console.log(d1DimData[obj].CategoryScore);
                d2.es = d2DimData[obj].CategoryScore;
            }
            else if (d2DimData[obj] !== null && d2DimData[obj].CategoryName === ResilienceCat.IE) {
                console.log(d1DimData[obj].CategoryScore);
                d2.ie = d2DimData[obj].CategoryScore;
            }
            else if (d2DimData[obj] !== null && d2DimData[obj].CategoryName === ResilienceCat.LS) {
                console.log(d1DimData[obj].CategoryScore);
                d2.ls = d2DimData[obj].CategoryScore;
            }
            else {

            }
        }
    }

    //for dataset 3
    if (d3DimData !== null && d3DimData !== undefined) {
        for (var obj in d3DimData) {

            if (d3DimData[obj] !== null && d3DimData[obj].CategoryName === ResilienceCat.HW) {
                console.log(d1DimData[obj].CategoryScore);
                d3.hw = d3DimData[obj].CategoryScore;
            }
            else if (d3DimData[obj] !== null && d3DimData[obj].CategoryName === ResilienceCat.ES) {
                console.log(d3DimData[obj].CategoryScore);
                d3.es = d3DimData[obj].CategoryScore;
            }
            else if (d3DimData[obj] !== null && d3DimData[obj].CategoryName === ResilienceCat.IE) {
                console.log(d3DimData[obj].CategoryScore);
                d3.ie = d3DimData[obj].CategoryScore;
            }
            else if (d3DimData[obj] !== null && d3DimData[obj].CategoryName === ResilienceCat.LS) {
                console.log(d3DimData[obj].CategoryScore);
                d3.ls = d3DimData[obj].CategoryScore;
            }
            else {

            }
        }
    }
    output[0] = d1;
    output[1] = d2;
    output[2] = d3;

    return output;

}
