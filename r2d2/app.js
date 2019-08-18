// Starts Here.....
//global variable --> .........................

//api key for google map.....
var mapKey = '';
var serviceURL = "http://172.29.81.232:8000/homepage/";
var serviceHisURL1 = "http://172.29.81.232:8000/compare/";
var serviceHisURL = "http://172.29.81.232:8000/history/";

var adlLattitude = -34.928101;
var adlLonggitude = 138.599899;
var defaultSuburbName = "ADELAIDE";

var resilienecScore;
var ResiliencyCategories = [];
var H_W = {},
    E_S = {},
    I_E = {},
    L_S = {};

var map,
    cachedGeoJson,
    LGAGeoJson,
    PCGeoJson,
    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

//initiate map on app load
var initMap = function () {
    var myLatLng = {
        lat: adlLattitude,
        lng: adlLonggitude
    };
    var map = new google.maps.Map(document.getElementById('map1'), {
        zoom: 12,
        center: myLatLng,
        styles: mapStyle5
    });


    var promise = $.getJSON("data/Suburbs.geojson"); //same as map.data.loadGeoJson();
    promise.then(function (data) {
        cachedGeoJson = data; //save the geojson in case we want to update its values
        map.data.addGeoJson(cachedGeoJson, {
            idPropertyName: "id"
        });
    });


    var setColorStyleFn = function (feature) {
            return {
                fillColor: colorValues[feature.getProperty('POSTCODE')],
                strokeWeight: 1
            };
        },

        setInvertedColorStyleFn = function (feature) {
            return {
                fillColor: invertedColorValues[feature.getProperty('POSTCODE')],
                strokeWeight: 1
            };
        };


    map.data.setStyle(setColorStyleFn);


    //get the legend container, create a legend, add a legend renderer fn
    var $legendContainer = $('#legend-container'),
        $legend = $(' <div id = "legend" > ').appendTo($legendContainer),
        renderLegend = function (colorValuesArray) {
            $legend.empty();
            $.each(colorValuesArray, function (index, val) {
                var $div = $(' <div style = "height:25px;" > ').append($(' <div class = "legend-color-box" > ').css({
                    backgroundColor: val,
                })).append($(" <span > ").css("lineHeight ", "23 px ").html("Zone " + index));
                $legend.append($div);
            });
        }
    //make a legend for the first time
    renderLegend(colorValues);

    //make a toggle button for color values
    var $toggleColorsButton = $(" <button > ").html("Toggle Colors ").click(function () {
        if (map.data.getStyle() === setColorStyleFn) {
            map.data.setStyle(setInvertedColorStyleFn);
            renderLegend(invertedColorValues);
        } else {
            map.data.setStyle(setColorStyleFn);
            renderLegend(colorValues);
        }
    });

    //add it to the legend
    $legendContainer.append($toggleColorsButton);

    //add the legend to the map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($legendContainer[0]);

    //listen for click events
    map.data.addListener('click', function (event) {
        //show an infowindow on click
        var pstcd = event.feature.getProperty("POSTCODE");
        var suburb = event.feature.getProperty("SUBURB");
        console.log("Selected Suburb is :- " + suburb);
        infoWindow.setContent(' <div style = "color:black;font-weight:bold;line-height:1.35;overflow:hidden;white-space:nowrap;" > Postcode : ' + pstcd + " <br / > Suburb : " + suburb + " </div>");
        var anchor = new google.maps.MVCObject();
        anchor.set("position", event.latLng);
        infoWindow.open(map, anchor);
        getSubUrbData(suburb);

    });
}

/* Log In Section */
var funcLogout = function () {
    $("#btnLogout").css('display', 'none');
    $("#dvLogin").css('display', 'block');
    $("#dvBodyMain").css('display', 'none');
}


//login function
var funcLogin = function () {
    console.log($("#txtUsrName").val());
    console.log($("#txtPwd").val());
    if ($("#txtUsrName").val() === "r2d2" && $("#txtPwd").val() === "r2d2") {
        $("#txtUsrName").val('');
        $("#txtPwd").val('');
        $("#btnLogout").css('display', 'block');
        $("#dvLogin").css('display', 'none');
        $("#dvBodyMain").css('display', 'block');
    } else {
        alert("Please enter correct username and password");
    }
}


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}




/* Home Section ******************************************************************************
*  All codes to populate data on Home screen
* */

//Setup default data
var setupDefaultData = function () {
    getSubUrbData(defaultSuburbName);
}


//get suburb data on Home Screen
var getSubUrbData = function (cd) {

    var code = cd;
    var type = document.getElementById('cmbLocTypeHom').value;

    document.getElementById('spnLocHom').innerHTML = code;
    document.getElementById('spnLocTypeHom').innerHTML = type;


    //Do Ajax Call.......
    var URL = serviceURL + "Suburb/" + code;  //Your URL
    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateHomeScreen);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();


}

//populate Home screen
var populateHomeScreen = function (result) {
    console.log(result);
    //alert(result);
    var data = JSON.parse(result);
    var dtData = data[0].Date;
    resilienecScore = Math.round(data[0].SuburbIndex);
    ResiliencyCategories = data[0].SuburbResiliencyCategories;

    for (var obj in ResiliencyCategories) {
        if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.HW) {
            console.log(ResiliencyCategories[obj]);
            H_W = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.ES) {
            console.log(ResiliencyCategories[obj]);
            E_S = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.IE) {
            console.log(ResiliencyCategories[obj]);
            I_E = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.LS) {
            console.log(ResiliencyCategories[obj]);
            L_S = ResiliencyCategories[obj];
        }
        else {

        }

        //populate the UI.
        document.getElementById('spnHmAggScr').innerHTML = resilienecScore;
        document.getElementById('spnDateHom').innerHTML = dtData;
        document.getElementById('spnHmHWScr').innerHTML = Math.round(H_W.CategoryScore);
        document.getElementById('spnHmESScr').innerHTML = Math.round(E_S.CategoryScore);
        document.getElementById('spnHmIEScr').innerHTML = Math.round(I_E.CategoryScore);
        document.getElementById('spnHmLSScr').innerHTML = Math.round(L_S.CategoryScore);


    }

}

//Select Health & Well Being Indicator on Home screen
var selHomHWIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = H_W.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }

    document.getElementById('spnHmHWInd').innerHTML = Math.round(ind);
}

//Select Economy & Society Indicator on home screen
var selHomESIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = E_S.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }
        document.getElementById('spnHmESInd').innerHTML = Math.round(H_W.CategoryScore);
}

//Select Infrastructure Indicator on Home screen
var selHomIEIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = I_E.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }
    document.getElementById('spnHmIEInd').innerHTML = Math.round(H_W.CategoryScore);
}

//Select leadership indicator on Home screen
var selHomLSIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = L_S.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }

    document.getElementById('spnHmLSInd').innerHTML = Math.round(H_W.CategoryScore);
}

//select Location type on Home screen
var selLocationTypeHome = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;

    if(value==="SUB"){
     initMap();
    }
    if(value==="LGA"){
        updateLgaMapData();
    }
}

//Get data for home screen
var btnHomGetData = function(){
    var loc = document.getElementById('dvSelLocHom').value;

    if(loc !== null && loc !== undefined){
        getSubUrbData(loc);
    }
}


/* History  Tab ******************************************************************************
*  All codes to populate data on History screen
* */

var resilieneScoreHis;
var ResiliencyCategoriesHis = [];


var H_W_his = {},
    E_S_his = {},
    I_E_his = {},
    L_S_his = {};

//Get Historical Suburb data
var getSubUrbDataHis = function (cd) {

    var loc = document.getElementById('dvSelLocHis').value;
    var dt =$('#dateHis').val();
    var type = document.getElementById('cmbLocTypeHis').value;

    console.log(loc);
    console.log(dt);

    var dtt = dt.split("/");
    var Yr = dtt[2];
    var d = dtt[1];
    var mon = dtt[0];

    document.getElementById('spnHisLoc').innerHTML = loc;
    document.getElementById('spnLocTypeHis').innerHTML = type;


    //Do Ajax Call.......
    var URL = serviceHisURL1 + loc+"/"+Yr+"/"+mon+"/"+d;

    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateHisScreen);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();


}

//Populate Historical screen
var populateHisScreen = function (result) {
    console.log(result);
    //alert(result);
    var data = JSON.parse(result);
    var dtData = data[0].Date;
    resilieneScoreHis = Math.round(data[0].SuburbIndex);
    ResiliencyCategoriesHis = data[0].SuburbResiliencyCategories;

    for (var obj in ResiliencyCategoriesHis) {
        if (ResiliencyCategoriesHis[obj] !== null && ResiliencyCategoriesHis[obj].CategoryName === ResilienceCat.HW) {
            console.log(ResiliencyCategories[obj]);
            H_W_his = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategoriesHis[obj] !== null && ResiliencyCategoriesHis[obj].CategoryName === ResilienceCat.ES) {
            console.log(ResiliencyCategoriesHis[obj]);
            E_S_his = ResiliencyCategoriesHis[obj];
        }
        else if (ResiliencyCategoriesHis[obj] !== null && ResiliencyCategoriesHis[obj].CategoryName === ResilienceCat.IE) {
            console.log(ResiliencyCategoriesHis[obj]);
            I_E_his = ResiliencyCategoriesHis[obj];
        }
        else if (ResiliencyCategoriesHis[obj] !== null && ResiliencyCategoriesHis[obj].CategoryName === ResilienceCat.LS) {
            console.log(ResiliencyCategoriesHis[obj]);
            L_S_his = ResiliencyCategoriesHis[obj];
        }
        else {

        }

        //populate the UI.
        document.getElementById('spnHisAggScr').innerHTML = resilieneScoreHis;
        document.getElementById('spnHisHWScr').innerHTML = Math.round(H_W_his.CategoryScore);
        document.getElementById('spnHisESScr').innerHTML = Math.round(E_S_his.CategoryScore);
        document.getElementById('spnHisIEScr').innerHTML = Math.round(I_E_his.CategoryScore);
        document.getElementById('spnHisLSScr').innerHTML = Math.round(L_S_his.CategoryScore);


    }

}

//Select Historic Health & Well being Indicator
var selHisHWIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = H_W.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }

    document.getElementById('spnHisHWInd').innerHTML = Math.round(ind);
}

//Select Historic Economics  & society Indicator
var selHisESIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = E_S_his.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }
    document.getElementById('spnHisESInd').innerHTML = Math.round(H_W.CategoryScore);
}

//Select Historic Infrastructure Indicator
var selHisIEIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = I_E_his.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }
    document.getElementById('spnHisIEInd').innerHTML = Math.round(H_W.CategoryScore);
}

//Select Historic Leadership Indicator
var selHisLSIndType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
    console.log(value);

    var data = L_S_his.Indicators;
    var ind = null;

    for (var obj in data) {
        if (data[obj] !== null && data[obj].IndicatorName === value) {
            console.log(data[obj].IndicatorScore);
            ind = data[obj].IndicatorScore;
        }
    }

    document.getElementById('spnHisLSInd').innerHTML = Math.round(H_W.CategoryScore);
}

//Select Historic analysis type
var selHisAnalType = function (event) {
    var selectElement = event.target;
    var value = selectElement.value;
}


/* Analysis  Section ******************************************************************************
*  All codes to populate data on Analysis screen
* */


//Get Analytic data1
var getAnalyticData1 = function (event) {

    var loc = document.getElementById('dvSelLoc1Anl').value;
    var dt =$('#dateAnaly1').val()
    console.log(loc);
    console.log(dt);

    var dtt = dt.split("/");
    var Yr = dtt[2];
    var d = dtt[1];
    var mon = dtt[0];

    //Do Ajax Call.......
    var URL = serviceHisURL1 + loc+"/"+Yr+"/"+mon+"/"+d;

    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateAnalyticsData1);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();

}

//get Analytics data 2
var getAnalyticData2 = function (event) {

    var loc = document.getElementById('dvSelLoc2Anl').value;
    var dt =$('#dateAnaly2').val()
    console.log(loc);
    console.log(dt);

    var dtt = dt.split("/");
    var Yr = dtt[2];
    var d = dtt[1];
    var mon = dtt[0];

    //Do Ajax Call.......
    var URL = serviceHisURL + "Suburb/" + loc+"/"+Yr+"/"+mon+"/"+d;

    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateAnalyticsData2);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();
}

//Populate analytics data 1 on the analytics screen
var populateAnalyticsData1 =function(result){
    console.log(result);
    //alert(result);
    var data = JSON.parse(result);
    var dtData = data[0].Date;
    var loc = data[0].Suburb;

    //populate data...........
    document.getElementById('spnAnlLoc1').innerHTML = loc;
    document.getElementById('spnAnlDt1').innerHTML = dtData;
    document.getElementById('spnAnlRs1').innerHTML = resilienecScore;



    resilienecScore = Math.round(data[0].SuburbIndex);
    ResiliencyCategories = data[0].SuburbResiliencyCategories;

    var hw_a =[],es_a =[],ie_a =[],ls_a =[];

    for (var obj in ResiliencyCategories) {
        if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.HW) {
            console.log(ResiliencyCategories[obj]);
            hw_a = ResiliencyCategories[obj];
            var data = hw_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlHW_1').innerHTML = Math.round(hw_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === HW_Ind["0"]) {
                    document.getElementById('spnAnlHWInd1_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["1"]){
                    document.getElementById('spnAnlHWInd2_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["2"]){
                    document.getElementById('spnAnlHWInd3_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["3"]){
                    document.getElementById('spnAnlHWInd4_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["4"]){
                    document.getElementById('spnAnlHWInd5_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["5"]){
                    document.getElementById('spnAnlHWInd6_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["6"]){
                    document.getElementById('spnAnlHWInd7_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["7"]){
                    document.getElementById('spnAnlHWInd8_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.ES) {
            console.log(ResiliencyCategories[obj]);
            es_a = ResiliencyCategories[obj];

            var data = es_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlES_1').innerHTML = Math.round(es_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === ES_Ind["0"]) {
                    document.getElementById('spnAnlESInd1_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["1"]){
                    document.getElementById('spnAnlESInd2_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["2"]){
                    document.getElementById('spnAnlESInd3_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["3"]){
                    document.getElementById('spnAnlESInd4_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }

        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.IE) {
            console.log(ResiliencyCategories[obj]);
            ie_a = ResiliencyCategories[obj];

            var data = ie_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlLS_1').innerHTML = Math.round(ie_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === IE_Ind["0"]) {
                    document.getElementById('spnAnlLSInd1_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === IE_Ind["1"]){
                    document.getElementById('spnAnlLSInd2_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }

        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.LS) {
            console.log(ResiliencyCategories[obj]);
            ls_a = ResiliencyCategories[obj];

            var data = ls_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlLS_1').innerHTML = Math.round(ls_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === LS_Ind["0"]) {
                    document.getElementById('spnAnlLSInd1_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === LS_Ind["1"]){
                    document.getElementById('spnAnlLSInd2_1').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }
        }
        else {

        }
    }



}

//Populate analytics data for 2nd suburb on screen
var populateAnalyticsData2 =function(result){
    console.log(result);
    //alert(result);
    var data = JSON.parse(result);
    var dtData = data[0].Date;

    var loc = data[0].Suburb;
    resilienecScore = Math.round(data[0].SuburbIndex);
    ResiliencyCategories = data[0].SuburbResiliencyCategories;

    //populate data...........
    document.getElementById('spnAnlLoc2').innerHTML = loc;
    document.getElementById('spnAnlDt2').innerHTML = dtData;
    document.getElementById('spnAnlRs2').innerHTML = resilienecScore;



    resilienecScore = Math.round(data[0].SuburbIndex);
    ResiliencyCategories = data[0].SuburbResiliencyCategories;

    var hw_a =[],es_a =[],ie_a =[],ls_a =[];

    for (var obj in ResiliencyCategories) {
        if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.HW) {
            console.log(ResiliencyCategories[obj]);
            hw_a = ResiliencyCategories[obj];
            var data = hw_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlHW_2').innerHTML = Math.round(hw_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === HW_Ind["0"]) {
                    document.getElementById('spnAnlHWInd1_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["1"]){
                    document.getElementById('spnAnlHWInd2_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["2"]){
                    document.getElementById('spnAnlHWInd3_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["3"]){
                    document.getElementById('spnAnlHWInd4_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["4"]){
                    document.getElementById('spnAnlHWInd5_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["5"]){
                    document.getElementById('spnAnlHWInd6_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["6"]){
                    document.getElementById('spnAnlHWInd7_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === HW_Ind["7"]){
                    document.getElementById('spnAnlHWInd8_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.ES) {
            console.log(ResiliencyCategories[obj]);
            es_a = ResiliencyCategories[obj];

            var data = es_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlES_2').innerHTML = Math.round(es_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === ES_Ind["0"]) {
                    document.getElementById('spnAnlESInd1_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["1"]){
                    document.getElementById('spnAnlESInd2_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["2"]){
                    document.getElementById('spnAnlESInd3_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === ES_Ind["3"]){
                    document.getElementById('spnAnlESInd4_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }

        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.IE) {
            console.log(ResiliencyCategories[obj]);
            ie_a = ResiliencyCategories[obj];

            var data = ie_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlLS_2').innerHTML = Math.round(ie_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === IE_Ind["0"]) {
                    document.getElementById('spnAnlLSInd1_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === IE_Ind["1"]){
                    document.getElementById('spnAnlLSInd2_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }

        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.LS) {
            console.log(ResiliencyCategories[obj]);
            ls_a = ResiliencyCategories[obj];

            var data = ls_a.Indicators;

            //show dimesnion score
            document.getElementById('spnAnlLS_1').innerHTML = Math.round(ls_a.CategoryScore);

            //show indicator score
            for (var obj in data) {
                if (data[obj] !== null && data[obj].IndicatorName === LS_Ind["0"]) {
                    document.getElementById('spnAnlLSInd1_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
                else if(data[obj] !== null && data[obj].IndicatorName === LS_Ind["1"]){
                    document.getElementById('spnAnlLSInd2_2').innerHTML = Math.round(data[obj].IndicatorScore);
                }
            }
        }
        else {

        }
    }
}

/* Chart Section***********************************************************************************
 *
  *
  * */

//get data for chart
var populateChart = function(){

    var loc = document.getElementById('dvSelLocHis').value;
    var analysisType = document.getElementById('cmbHisAnalysisTypeSel').value;
    var dt =$('#dateHisChar1').val();
    var dtt = dt.split("/");
    var Yr = Number(dtt[2]);
    var d = Number(dtt[1]);
    var mon = Number(dtt[0]);
    var q = getQuarter(mon);

    console.log(loc);
    console.log(analysisType);

    //Do Ajax Call.......
    if(analysisType ==="Y1"){
        var URL = serviceHisURL+"Suburb/"+ loc+"/"+Yr;
    }
    else if(analysisType ==="M1"){
        var URL = serviceHisURL+"Suburb/"+ loc+"/"+Yr+"/"+mon;
    }
    else if(analysisType ==="D1")
    {

        var URL = serviceHisURL+"Suburb/"+ loc+"/"+Yr+"/"+mon+"/"+d;
    }
    else if(analysisType ==="Q1")
    {

        var URL = serviceHisURL+"Quarter/"+ loc+"/"+Yr+"/"+q;
    }


    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateChartOnUI);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();
}

//populate chart on UI
var populateChartOnUI = function(result){
    console.log(result);

    var type = document.getElementById('cmbHisAnalysisTypeSel').value;
    var data = JSON.parse(result);
    data.sort(cusSort);
    console.log(data);
    updateLineChart(data,type);
    updateRadarChart(data,type);

}


/* LGA code *********************************************************************************/

var H_W_lga = {},
    E_S_lga = {},
    I_E_lga = {},
    L_S_lga = {};

var updateLgaMapData = function (type) {
    var myLatLng = {
        lat: adlLattitude,
        lng: adlLonggitude
    };
    var map = new google.maps.Map(document.getElementById('map1'), {
        zoom: 12,
        center: myLatLng,
        styles: mapStyle5
    });


    var promise = $.getJSON("data/LGA.geojson"); //same as map.data.loadGeoJson();
    promise.then(function (data) {
        LGAGeoJson = data; //save the geojson in case we want to update its values
        map.data.addGeoJson(LGAGeoJson, {
            idPropertyName: "id"
        });
    });




    //listen for click events
    map.data.addListener('click', function (event) {
        //show an infowindow on click
        var lgatyp = event.feature.getProperty("LGATYPE");
        var lga = event.feature.getProperty("LGA");
        console.log("Selected Suburb is :- " + lga);
        infoWindow.setContent(' <div style = "color:black;font-weight:bold;line-height:1.35;overflow:hidden;white-space:nowrap;" > LGA Type : ' + lgatyp + " <br / > LGA : " + lga + " </div>");
        var anchor = new google.maps.MVCObject();
        anchor.set("position", event.latLng);
        infoWindow.open(map, anchor);
        getLgaDataHom(lga);

    });
}

var getLgaDataHom = function (cd) {

    var code = cd;
    var type = document.getElementById('cmbLocTypeHom').value;

    document.getElementById('spnLocHom').innerHTML = code;
    document.getElementById('spnLocTypeHom').innerHTML = type;


    //Do Ajax Call.......
    var URL = serviceURL + "LGA/" + code;  //Your URL
    console.log(URL);
    //create new HTTP request
    var req = newXMLHttpRequest();
    //attach callback method for respons ecoming back.
    req.onreadystatechange = getReadyStateHandler(req, populateHomeScreenLga);
    //do a POST on servlet
    req.open("GET", URL, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //req is appended with parameter add and item code.
    req.send();

}


//Populate LGA data on Home screen
var populateHomeScreenLga = function (result) {
    console.log(result);
    //alert(result);
    var data = JSON.parse(result);
    var dtData = data[0].Date;
    resilienecScore = Math.round(data[0].LGAIndex);
    ResiliencyCategories = data[0].LGAResiliencyCategories;

    for (var obj in ResiliencyCategories) {
        if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.HW) {
            console.log(ResiliencyCategories[obj]);
            H_W_lga = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.ES) {
            console.log(ResiliencyCategories[obj]);
            E_S_lga = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.IE) {
            console.log(ResiliencyCategories[obj]);
            I_E_lga = ResiliencyCategories[obj];
        }
        else if (ResiliencyCategories[obj] !== null && ResiliencyCategories[obj].CategoryName === ResilienceCat.LS) {
            console.log(ResiliencyCategories[obj]);
            L_S_lga = ResiliencyCategories[obj];
        }
        else {

        }

        //populate the UI.
        document.getElementById('spnHmAggScr').innerHTML = resilienecScore;
        document.getElementById('spnDateHom').innerHTML = dtData;
        document.getElementById('spnHmHWScr').innerHTML = Math.round(H_W_lga.CategoryScore);
        document.getElementById('spnHmESScr').innerHTML = Math.round(E_S_lga.CategoryScore);
        document.getElementById('spnHmIEScr').innerHTML = Math.round(I_E_lga.CategoryScore);
        document.getElementById('spnHmLSScr').innerHTML = Math.round(L_S_lga.CategoryScore);


    }

}


/* Additional Code .......Helper **********************************************************/

//get Quarter
var getQuarter =function (m) {
    //d = d || new Date();
    var q=[4,1,2,3];
    var m1 = q[Math.floor(m/3)];
    return m1;
}

//Sort the array
var cusSort = function(a, b) {
    var type = document.getElementById('cmbHisAnalysisTypeSel').value;

    if(type="D1"){
        return a.Date - b.Date;
    }
    else if((type="M1")){
        return a._id.Year - b._id.Year || a._id.Month - b._id.Month;
    }
    else if((type="Y1")){
        return a._id.Year - b._id.Year;
    }
    else{

    }

}
