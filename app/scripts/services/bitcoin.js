'use strict';

/**
 * @ngdoc function
 * @name App.service:BitcoinService
 * @description
 * # BitcoinService
 * Service of the App
 */
angular.module('App')
    .service('BitcoinService', function (ResourcesGeneratorService) {
        this.getInfo = function () {
            return ResourcesGeneratorService.getResource('bitcoin/getinfo').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getConfirmedBalance = function () {
            return ResourcesGeneratorService.getResource('bitcoin/getconfirmedbalance').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getUnconfirmedBalance = function () {
            return ResourcesGeneratorService.getResource('bitcoin/getunconfirmedbalance').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getNewAddress = function () {
            return ResourcesGeneratorService.getResource('bitcoin/getnewaddress').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.sendToAddress = function (address, amount) {
            return ResourcesGeneratorService.getResource('bitcoin/sendtoaddress').post({
                address: address,
                amount: amount
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getRawTransaction = function (txid) {
            return ResourcesGeneratorService.getResource('bitcoin/getrawtransaction/:txid').get({txid: txid}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
