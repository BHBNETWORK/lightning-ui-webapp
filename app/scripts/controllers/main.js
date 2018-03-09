'use strict';

/**
 * @ngdoc function
 * @name App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MainCtrl', function ($scope, $rootScope, $location) {
        $rootScope.$emit('page-title', 'BHB ⚡️ Dashboard');

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
