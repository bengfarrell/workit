'use strict';

angular.module('workitApp')
  .controller('MainCtrl', function ($scope) {

        var sanitize = require("sanitize-filename");
        var fs = require('fs');
        var path = require('path');

        // typeahead for project name
        $scope.projects = [];
        var projects = fs.readdirSync('localstore');
        for (var c in projects) {
            $scope.projects.push(projects[c].split('.')[0]);
        }

        /** whether we are recording */
        $scope.recording = false;

        /** times recorded */
        $scope.times = [];

        /**
         * toggle timer
         */
        $scope.timerToggle = function() {
            console.log($scope.description);
            if ($scope.description == undefined ) { $scope.description = "untitled project"; }
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
                    $scope.recordTime($scope.times[$scope.times.length-1]);
                }
            }
        }

        /**
         * record time/task
         * @param segment
         */
        $scope.recordTime = function(segment) {
            var filename = sanitize(segment.description);

            var data = {};
            if (fs.existsSync('localstore' + path.sep + filename + '.json')) {
                var raw = fs.readFileSync('localstore' + path.sep + filename + '.json', 'utf8');
                data = JSON.parse(raw);
            }

            if (!data[segment.start.toDateString()]) {
                data[segment.start.toDateString()] = [];
            }

            data[segment.start.toDateString()].push(segment);
            fs.writeFileSync('localstore' + path.sep + filename + '.json', JSON.stringify(data, undefined, 2) );
            $scope.exportTimes();
        }

        /**
         * export times to file
         */
        $scope.exportTimes = function() {

            var fs = require('fs');
            var path = require('path');

            if (!fs.existsSync('reports')) {
                fs.mkdirSync('reports');
            }

            fs.readdirSync('localstore').forEach(function(proj) {
                var prjdata = JSON.parse( fs.readFileSync('localstore' + path.sep + proj) );

                var ttlTime = 0;
                var output = "<h1>Report for " + proj.split('.')[0] + "</h1>"
                for (var c in prjdata) {
                    var ttlTimeForDay = 0;
                    output += "<h2>" + c + "</h2> \n <ul> \n";
                    for (var d in prjdata[c]) {
                        var start = new Date(prjdata[c][d].start);
                        var end = new Date(prjdata[c][d].end);
                        ttlTime += parseFloat(prjdata[c][d].duration);
                        ttlTimeForDay += parseFloat(prjdata[c][d].duration);
                        output += "<li>" + start.toLocaleTimeString() + " - " + end.toLocaleTimeString() + "  (" + prjdata[c][d].duration + " hours)</li> \n";
                    }
                    output += "</ul>";
                    output += "<p><strong>Time worked on this day: " + ttlTimeForDay.toFixed(2) + " hours</strong></p>";
                }

                output += "<h1><strong>Time worked on this project: " + ttlTime.toFixed(2) + " hours</strong></h1>";

                fs.writeFile('reports' + path.sep + proj.split('.')[0] + '.html', output, function(err) {
                    if(err) {
                        alert("Error: " + err.toString() );
                    }
                });
            });
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
