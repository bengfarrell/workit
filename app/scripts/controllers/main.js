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
                $scope.times[$scope.times.length-1].end = new Date();
                $scope.times[$scope.times.length-1].description = $scope.description;
            }
        }

        $scope.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];
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
