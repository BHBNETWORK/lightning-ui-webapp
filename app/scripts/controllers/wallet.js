'use strict';

/**
 * @ngdoc function
 * @name App.controller:WalletCtrl
 * @description
 * # WalletCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('WalletCtrl', function ($scope, $rootScope, $location) {
        $rootScope.$emit('page-title', 'Wallet');

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
