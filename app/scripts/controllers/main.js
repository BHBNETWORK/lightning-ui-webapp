'use strict';

/**
 * @ngdoc function
 * @name App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MainCtrl', function ($rootScope, $q, BitcoinService, LightningService) {
        $rootScope.$emit('page-title', 'Dashboard');

        $q.all([BitcoinService.getInfo(), LightningService.getInfo()])
            .then(function (data) {
                var bitcoin = data[0];
                var lightning = data[1];

                console.log('bitcoin:', bitcoin);
                console.log('lightning:', lightning);
            });
    });
