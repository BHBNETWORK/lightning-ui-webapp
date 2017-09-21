'use strict';

/**
 * @ngdoc function
 * @name App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MainCtrl', function ($rootScope) {
        $rootScope.$emit('page-title', 'Dashboard');
    });
