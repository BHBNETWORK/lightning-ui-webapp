'use strict';

/**
 * @ngdoc function
 * @name App.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SettingsCtrl', function ($scope, $rootScope, $location) {
        $rootScope.$emit('page-title', 'Settings');

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
