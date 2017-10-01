angular.module("weatherApp", ['ngMaterial']);

angular.module("weatherApp").controller("Main", [function () {
    var self = this;
    self.name = "Brian";
}]);

// angular.module("weatherApp", []).component("welcome", function ($scope) {
// });