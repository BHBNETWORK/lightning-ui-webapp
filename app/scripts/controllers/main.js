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
        $rootScope.$emit('page-title', 'Dashboard');

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
