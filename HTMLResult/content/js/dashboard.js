/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 87.55495434562056, "KoPercent": 12.445045654379438};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5912086145933784, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14563106796116504, 500, 1500, "6.2 Filter 2 /api/v1/home/filteredData?userId=ext_judavmar&locale=en_US&pageNumber=1"], "isController": false}, {"data": [0.0, 500, 1500, "6  Bring filter values /api/v1/options/defaultFilters?locale=en_US"], "isController": false}, {"data": [0.6164383561643836, 500, 1500, "5/api/v1/template/filterFields"], "isController": false}, {"data": [0.7392996108949417, 500, 1500, "11 /api/v1/home"], "isController": false}, {"data": [0.3073770491803279, 500, 1500, "16 /api/v1/options/editfields?locale=en_US"], "isController": false}, {"data": [0.0, 500, 1500, "SSFF PMO_REING_Employee_precreated Cookies"], "isController": true}, {"data": [0.737037037037037, 500, 1500, "10 get level /api/v1/home"], "isController": false}, {"data": [0.7127659574468085, 500, 1500, "18 /api/v1/validateRequest?locale=en_US"], "isController": false}, {"data": [0.0, 500, 1500, "23 /api/v1/home/download"], "isController": false}, {"data": [0.98, 500, 1500, "13/api/v1/options/getDivAreaSubArea"], "isController": false}, {"data": [0.3466981132075472, 500, 1500, "22 /api/v1/home/getAdminHierarchy"], "isController": false}, {"data": [0.325, 500, 1500, "6.3 Reset Filter /api/v1/home/getAdminHierarchy"], "isController": false}, {"data": [0.7339285714285714, 500, 1500, "8 /api/v1/template/viewFields/1"], "isController": false}, {"data": [0.4339622641509434, 500, 1500, "6.1 Filter 1 /api/v1/home/filterMetadata?locale=en_US"], "isController": false}, {"data": [0.6168831168831169, 500, 1500, "19 /api/v1/validateRequest/getEmployeesToUpdate?locale=en_US"], "isController": false}, {"data": [0.995, 500, 1500, "2/assets/locales/en.json"], "isController": false}, {"data": [0.28496503496503495, 500, 1500, "7 /api/v1/config/sfConfig"], "isController": false}, {"data": [0.7217573221757322, 500, 1500, "17/api/v1/employeeDetails/validateGroupValue?locale=en_US"], "isController": false}, {"data": [0.6147540983606558, 500, 1500, "15/api/v1/template/editFields"], "isController": false}, {"data": [0.9933774834437086, 500, 1500, "1 Colaboradores  Index"], "isController": false}, {"data": [0.6774193548387096, 500, 1500, "21 /api/v1/template/viewFields/1"], "isController": false}, {"data": [0.008888888888888889, 500, 1500, "20 /api/v1/batch/batchRequest"], "isController": false}, {"data": [0.7303149606299213, 500, 1500, "12 /api/v1/employeeDetails/getPayFrequency?locale=en_US"], "isController": false}, {"data": [0.9983277591973244, 500, 1500, "3/assets/locales/es.json"], "isController": false}, {"data": [0.009345794392523364, 500, 1500, "Filter"], "isController": true}, {"data": [0.34854014598540145, 500, 1500, "9 /api/v1/home/getAdminHierarchy"], "isController": false}, {"data": [0.6949152542372882, 500, 1500, "4 /api/v1/home/activeCount"], "isController": false}, {"data": [0.6854838709677419, 500, 1500, "14 /api/v1/options/getStatus"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5914, 736, 12.445045654379438, 5066.147615826846, 0, 74760, 364.5, 30095.0, 30101.0, 30304.0, 9.447057977843981, 28.120767810575625, 8.092581085816635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["6.2 Filter 2 /api/v1/home/filteredData?userId=ext_judavmar&locale=en_US&pageNumber=1", 103, 26, 25.24271844660194, 7850.281553398057, 102, 30304, 2405.0, 30097.6, 30112.2, 30303.24, 0.1774494484423212, 0.32652300188475436, 0.1661468715059256], "isController": false}, {"data": ["6  Bring filter values /api/v1/options/defaultFilters?locale=en_US", 100, 7, 7.0, 9658.250000000002, 2364, 30112, 7821.0, 18416.800000000003, 30097.95, 30111.99, 0.3132576920426281, 7.0326045947855125, 0.28052471054989253], "isController": false}, {"data": ["5/api/v1/template/filterFields", 292, 41, 14.04109589041096, 6520.441780821917, 312, 30638, 460.0, 30098.7, 30112.35, 30320.07, 0.4756250315590239, 0.17529574368534473, 0.4352154829793022], "isController": false}, {"data": ["11 /api/v1/home", 257, 24, 9.33852140077821, 4508.128404669263, 151, 30316, 261.0, 24690.60000000003, 30098.1, 30298.68, 0.4376993703600886, 0.5177006524828796, 0.34091812658708603], "isController": false}, {"data": ["16 /api/v1/options/editfields?locale=en_US", 244, 37, 15.163934426229508, 5444.000000000001, 102, 30305, 1399.0, 30096.5, 30102.0, 30300.3, 0.42875166492705946, 6.296507584862957, 0.42421800594453635], "isController": false}, {"data": ["SSFF PMO_REING_Employee_precreated Cookies", 210, 186, 88.57142857142857, 97658.80952380953, 12163, 236418, 86084.5, 168893.2, 199069.29999999987, 234214.62999999983, 0.3753270707330674, 26.13107912564878, 7.380570172087463], "isController": true}, {"data": ["10 get level /api/v1/home", 270, 25, 9.25925925925926, 4960.496296296295, 152, 30436, 280.5, 29407.4, 30099.45, 30295.03, 0.4566704327882605, 2.827209188145681, 0.39423502205549055], "isController": false}, {"data": ["18 /api/v1/validateRequest?locale=en_US", 235, 31, 13.191489361702128, 4174.097872340428, 100, 30308, 374.0, 29815.4, 30100.2, 30288.64, 0.4209440251921565, 0.2308002644110635, 0.5103281583340648], "isController": false}, {"data": ["23 /api/v1/home/download", 42, 42, 100.0, 30132.833333333332, 30094, 30420, 30098.5, 30293.8, 30316.45, 30420.0, 0.07995872606711583, 0.030140691662018274, 0.06848027613365291], "isController": false}, {"data": ["13/api/v1/options/getDivAreaSubArea", 250, 0, 0.0, 326.7679999999998, 280, 1482, 299.0, 352.30000000000007, 438.7499999999996, 1086.8000000000038, 0.4519398160785724, 0.5214926476171021, 0.36398985632381303], "isController": false}, {"data": ["22 /api/v1/home/getAdminHierarchy", 212, 38, 17.92452830188679, 7284.136792452835, 509, 30487, 1080.0, 30099.0, 30191.95, 30389.04, 0.38896441892935707, 0.8383730571273142, 0.2841263528898038], "isController": false}, {"data": ["6.3 Reset Filter /api/v1/home/getAdminHierarchy", 100, 19, 19.0, 7837.980000000001, 527, 30319, 1034.0, 30100.7, 30128.95, 30319.0, 0.17440927578292323, 0.37186476163048254, 0.13864174852275343], "isController": false}, {"data": ["8 /api/v1/template/viewFields/1", 280, 30, 10.714285714285714, 4577.94642857143, 103, 30318, 134.0, 30094.9, 30109.55, 30305.52, 0.4684185520513387, 0.4114182615900133, 0.3654945537978707], "isController": false}, {"data": ["6.1 Filter 1 /api/v1/home/filterMetadata?locale=en_US", 106, 16, 15.09433962264151, 4913.0471698113215, 103, 30450, 904.0, 24224.099999999977, 30105.85, 30439.78, 0.18070142839364953, 0.08360337773161747, 0.16636437888998182], "isController": false}, {"data": ["19 /api/v1/validateRequest/getEmployeesToUpdate?locale=en_US", 231, 58, 25.10822510822511, 5714.770562770564, 99, 30680, 188.0, 30098.0, 30101.4, 30400.04, 0.4105301881863274, 1.0285070368828495, 0.4388471632541715], "isController": false}, {"data": ["2/assets/locales/en.json", 300, 0, 0.0, 113.97333333333336, 93, 886, 99.0, 111.90000000000003, 148.69999999999993, 683.0000000000018, 0.5066994107085853, 4.32525346582397, 0.413672565773806], "isController": false}, {"data": ["7 /api/v1/config/sfConfig", 286, 28, 9.79020979020979, 5768.5734265734245, 704, 30533, 1179.5, 30048.5, 30099.65, 30349.39, 0.47374994616477883, 0.2745725690498829, 0.3613268632370042], "isController": false}, {"data": ["17/api/v1/employeeDetails/validateGroupValue?locale=en_US", 239, 35, 14.644351464435147, 5179.62761506276, 104, 30313, 144.0, 29540.0, 30099.0, 30305.6, 0.4250180943895833, 0.18882129056121952, 0.4737533960323939], "isController": false}, {"data": ["15/api/v1/template/editFields", 244, 25, 10.245901639344263, 5351.368852459015, 311, 30308, 489.5, 30095.0, 30099.75, 30219.600000000002, 0.44816610064267753, 0.7204565669190968, 0.3833920939091655], "isController": false}, {"data": ["1 Colaboradores  Index", 302, 0, 0.0, 206.04966887417217, 93, 1306, 120.5, 324.7, 361.5499999999999, 506.84999999999985, 0.5068942655488138, 0.4707582485712128, 0.33363938962880907], "isController": false}, {"data": ["21 /api/v1/template/viewFields/1", 217, 35, 16.129032258064516, 6922.2488479262665, 103, 30321, 143.0, 30098.2, 30112.2, 30312.28, 0.39340743413144885, 0.33357341535666823, 0.28698764970331275], "isController": false}, {"data": ["20 /api/v1/batch/batchRequest", 225, 62, 27.555555555555557, 8780.91111111111, 106, 30452, 4178.0, 30098.4, 30111.7, 30299.74, 0.40784217051790517, 0.18896864248827228, 0.35314812804975315], "isController": false}, {"data": ["12 /api/v1/employeeDetails/getPayFrequency?locale=en_US", 254, 31, 12.204724409448819, 4393.433070866142, 102, 30310, 121.5, 24155.0, 30099.0, 30292.0, 0.43871239638874066, 0.20784256162268316, 0.43479917680973185], "isController": false}, {"data": ["3/assets/locales/es.json", 299, 0, 0.0, 110.06688963210698, 93, 666, 99.0, 117.0, 161.0, 311.0, 0.5066611538318156, 4.5827105535061285, 0.4136413326205057], "isController": false}, {"data": ["Filter", 107, 41, 38.3177570093458, 20373.990654205605, 0, 90530, 7610.0, 60772.200000000004, 63658.79999999999, 90528.72, 0.18117383714334576, 0.7649686946001731, 0.4631302510781537], "isController": true}, {"data": ["9 /api/v1/home/getAdminHierarchy", 274, 40, 14.598540145985401, 6577.886861313868, 511, 30446, 1043.0, 30098.0, 30111.25, 30434.75, 0.47442519232400815, 1.0567905027521856, 0.3465527772054278], "isController": false}, {"data": ["4 /api/v1/home/activeCount", 295, 42, 14.23728813559322, 6682.983050847453, 101, 30785, 135.0, 30098.0, 30109.2, 30299.36, 0.4821301326429884, 0.21444799726002992, 0.3606559390669229], "isController": false}, {"data": ["14 /api/v1/options/getStatus", 248, 36, 14.516129032258064, 6477.157258064515, 115, 30320, 169.0, 30098.0, 30109.55, 30308.51, 0.4286178457114019, 0.2705849310365984, 0.3426519098122377], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 58, 7.880434782608695, 0.9807237064592492], "isController": false}, {"data": ["504/Gateway Timeout", 612, 83.15217391304348, 10.34832600608725], "isController": false}, {"data": ["502/Bad Gateway", 31, 4.211956521739131, 0.524179912073047], "isController": false}, {"data": ["500/Internal Server Error", 27, 3.6684782608695654, 0.45654379438620224], "isController": false}, {"data": ["502", 2, 0.2717391304347826, 0.033818058843422386], "isController": false}, {"data": ["504", 6, 0.8152173913043478, 0.10145417653026716], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5914, 736, "504/Gateway Timeout", 612, "400/Bad Request", 58, "502/Bad Gateway", 31, "500/Internal Server Error", 27, "504", 6], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["6.2 Filter 2 /api/v1/home/filteredData?userId=ext_judavmar&locale=en_US&pageNumber=1", 103, 26, "504/Gateway Timeout", 18, "400/Bad Request", 5, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": ["6  Bring filter values /api/v1/options/defaultFilters?locale=en_US", 100, 7, "504/Gateway Timeout", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["5/api/v1/template/filterFields", 292, 41, "504/Gateway Timeout", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["11 /api/v1/home", 257, 24, "504/Gateway Timeout", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["16 /api/v1/options/editfields?locale=en_US", 244, 37, "504/Gateway Timeout", 26, "502/Bad Gateway", 6, "400/Bad Request", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["10 get level /api/v1/home", 270, 25, "504/Gateway Timeout", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["18 /api/v1/validateRequest?locale=en_US", 235, 31, "504/Gateway Timeout", 23, "400/Bad Request", 5, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": ["23 /api/v1/home/download", 42, 42, "504/Gateway Timeout", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["22 /api/v1/home/getAdminHierarchy", 212, 38, "504/Gateway Timeout", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6.3 Reset Filter /api/v1/home/getAdminHierarchy", 100, 19, "504/Gateway Timeout", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["8 /api/v1/template/viewFields/1", 280, 30, "504/Gateway Timeout", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["6.1 Filter 1 /api/v1/home/filterMetadata?locale=en_US", 106, 16, "504/Gateway Timeout", 10, "400/Bad Request", 5, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["19 /api/v1/validateRequest/getEmployeesToUpdate?locale=en_US", 231, 58, "400/Bad Request", 26, "504/Gateway Timeout", 26, "502/Bad Gateway", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["7 /api/v1/config/sfConfig", 286, 28, "504/Gateway Timeout", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["17/api/v1/employeeDetails/validateGroupValue?locale=en_US", 239, 35, "504/Gateway Timeout", 23, "400/Bad Request", 6, "502/Bad Gateway", 6, "", "", "", ""], "isController": false}, {"data": ["15/api/v1/template/editFields", 244, 25, "504/Gateway Timeout", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["21 /api/v1/template/viewFields/1", 217, 35, "504/Gateway Timeout", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["20 /api/v1/batch/batchRequest", 225, 62, "504/Gateway Timeout", 35, "500/Internal Server Error", 27, "", "", "", "", "", ""], "isController": false}, {"data": ["12 /api/v1/employeeDetails/getPayFrequency?locale=en_US", 254, 31, "504/Gateway Timeout", 19, "400/Bad Request", 6, "502/Bad Gateway", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Filter", 9, 8, "504", 6, "502", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["9 /api/v1/home/getAdminHierarchy", 274, 40, "504/Gateway Timeout", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["4 /api/v1/home/activeCount", 295, 42, "504/Gateway Timeout", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["14 /api/v1/options/getStatus", 248, 36, "504/Gateway Timeout", 36, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
