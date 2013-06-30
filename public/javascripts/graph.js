google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {

    //variables to use in each line chart.
    var axes = ['Time', 'Money', 'Income'];
    var companyData = {};

    //chart options
    var options = {
        width: 1280,
        height: 800
    };

    //build up data for each different company
    for (var i = 0; i < window.data.length; i++) {
        var record = window.data[i];
        if (!companyData.hasOwnProperty(record.companyName)) {
            companyData[record.companyName] = [axes];
        }
        var income = (i > 0) ? window.data[i].companyMoney - window.data[i-1].companyMoney : 0;
        companyData[record.companyName].push([window.data[i].timestep, window.data[i].companyMoney, income]);
    }

    //construct per company graphs
    for (var company in companyData) {
        if (companyData.hasOwnProperty(company)) {

            var chartDiv = document.createElement('div');
            chartDiv.className = 'chart';
            document.getElementsByTagName('body')[0].appendChild(chartDiv);

            var data = google.visualization.arrayToDataTable(companyData[company]);
            var chart = new google.visualization.LineChart(chartDiv);

            options.title = company;
            chart.draw(data, options);
        }
    }
}
