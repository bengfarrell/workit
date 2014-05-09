'use strict';

angular.module('workitApp')
  .controller('MainCtrl', function ($scope) {

        /** whether we are recording */
        $scope.recording = false;

        /** times recorded */
        $scope.times = [];

        /**
         * toggle timer
         */
        $scope.timerToggle = function() {
            $scope.recording = !$scope.recording;
            if ($scope.recording == true) {
                $scope.times.push( { start: new Date(), description: $scope.description } );
            } else {
                if ($scope.times.length > 0) {
                    $scope.times[$scope.times.length-1].end = new Date();
                    $scope.times[$scope.times.length-1].description = $scope.description;

                    var sec =  ($scope.times[$scope.times.length-1].end - $scope.times[$scope.times.length-1].start) /1000;
                    var min = Math.ceil(sec/60);
                    var hrs = min/60;
                    $scope.times[$scope.times.length-1].duration = hrs.toFixed(2);
                }
            }
        }

        /**
         * export times to file
         */
        $scope.exportTimes = function() {

            if ($scope.times.length == 0) {
                alert("nothing to save");
                return;
            }
            var output = "<h1>" + $scope.times[0].start.toLocaleDateString() + "</h1><ul>";
            for (var c in $scope.times) {
                if ($scope.times[c].end) {
                    output += "<li>" + $scope.times[c].start.toLocaleTimeString() + " - " + $scope.times[c].end.toLocaleTimeString() + "  " + $scope.times[c].description + "  (" + $scope.times[c].duration + " hours)</li>";
                }
            }
            output += "</ul>";
            var filename = new Date().getTime() + ".html";

            var fs = require('fs');
            var path = require('path');
            var savepath = path.normalize(__dirname + "/../worksessions");
            if (!fs.existsSync(savepath)) {
                fs.mkdirSync(savepath);
            }
            var filepath = path.normalize(savepath + "/" + filename);
            fs.writeFile(filepath, output, function(err) {
                if(err) {
                    alert("Error: " + err.toString() );
                } else {
                    alert("saved");
                }
            });
            $scope.times = [];
        }

  }).directive('currenttime', function() {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                setInterval(function() {
                    element.html(new Date().toLocaleTimeString());
                }, 1000);
            }
        }
    });
