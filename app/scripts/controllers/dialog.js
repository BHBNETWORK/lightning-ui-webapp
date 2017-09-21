'use strict';

/**
 * @ngdoc function
 * @name App.controller:DialogCtrl
 * @description
 * # DialogCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('DialogCtrl', function ($scope, $mdDialog, items) {
        $scope.close = function () {
            $mdDialog.cancel();
        };

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                $scope[key] = items[key];
            }
        }
    });
