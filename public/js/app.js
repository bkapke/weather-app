angular.module("weatherApp", ['ngMaterial']);


// Weather service
angular.module("weatherApp").service('weatherService', [
    '$http', 
    '$q',  

    function($http, $q) {
    var self = this;
    self.apiKey = 'APPID=49d69f9abc77d2a27554306b40cb1376';
    self.baseUrl = 'http://api.openweathermap.org/data/2.5/';
    
    var cities =  {
      minneapolis : {
        "id": 5037649,
        "name": "Minneapolis",
        "country": "US",
        "coord": {
          "lon": -93.26384,
          "lat": 44.979969
        }
      }
    };
    //history
    var url = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&id=' + cities.minneapolis.id + '&' + self.apiKey;
    self.getWeather = function() {
        var deferred = $q.defer();
        if(!self.weather) {
            $http.get(url).then(function(res) {
                self.weather = res.data;
                deferred.resolve(res.data)
            });
        } else {
            deferred.resolve(self.weather);
        }
        return deferred.promise;
    };
}]);

angular.module("weatherApp").service('graphService', [function() {
    var self = this;
    self.drawGraph = function(elemClass, data) {
        var elem = d3.select(elemClass)
            .attr("height","100%")
            .attr("width","100%");
        
        elem.selectAll("rect")
            .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("height", function(d, i) {return (d * 1)})
                .attr("width","20")
                .attr("x", function(d, i) {return (i * 30) + 25})
                .attr("y", function(d, i) {return 120 - (d * 1)});

        elem.selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function(d) {return d})
                .attr("x", function(d, i) {return (i * 30) + 25})
                .attr("y", function(d, i) {return 115 - (d * 1)});
    };
}]);

angular.module("weatherApp").service('appUtils', [function() {
    var self = this;
    self.getValueArrayByProps = function(arrayToProcess, obj, key) {
        var valArray = [],
            length = arrayToProcess.length;
        for (var i = 0; i < length; i++) {
            valArray.push(Math.floor(arrayToProcess[i][obj][key]));
        }
        return valArray
    };
}])

// Main app controller
angular.module("weatherApp").controller("Main", [
    'weatherService', 
    'graphService', 
    'appUtils', 

function (weatherService, graphService, appUtils) {
    var self = this;
    self.name = "Brian";
    self.weather = null;
    weatherService.getWeather().then(function(res){
        self.weather = res;
        self.initGraphs();
    });

    self.formatDate = function(date) {
        return moment(date).format('dddd hh:mmA');
    }

    self.initGraphs = function() {
        var humidityData = appUtils.getValueArrayByProps(self.weather.list, 'main', 'humidity'),
            lowTempArray = appUtils.getValueArrayByProps(self.weather.list, 'main', 'temp_min'),
            highTempArray = appUtils.getValueArrayByProps(self.weather.list, 'main', 'temp_max');
        
        var humidity = graphService.drawGraph('.humidity-graph', humidityData);
        var highTemp = graphService.drawGraph('.high-temp-graph', lowTempArray);
        var lowTemp = graphService.drawGraph('.low-temp-graph', highTempArray);
    };
              
}]);


