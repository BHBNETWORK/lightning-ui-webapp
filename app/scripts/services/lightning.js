'use strict';

/**
 * @ngdoc function
 * @name App.service:LightningService
 * @description
 * # LightningService
 * Service of the App
 */
angular.module('App')
    .service('LightningService', function (ResourcesGeneratorService) {
        this.getInfo = function () {
            return ResourcesGeneratorService.getResource('lightning/getinfo').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getPeers = function () {
            return ResourcesGeneratorService.getResource('lightning/getpeers').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getNodes = function () {
            return ResourcesGeneratorService.getResource('lightning/getnodes').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getChannels = function () {
            return ResourcesGeneratorService.getResource('lightning/getchannels').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getNewAddress = function () {
            return ResourcesGeneratorService.getResource('lightning/getnewaddress').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.openChannel = function (hostname, port, nodeid, amount) {
            return ResourcesGeneratorService.getResource('lightning/openchannel').post({
                ip: hostname,
                post: port,
                nodeid: nodeid,
                amount: amount
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addFunds = function (rawtx) {
            return ResourcesGeneratorService.getResource('lightning/addfunds').post({rawtx: rawtx}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.closeChannel = function (nodeid) {
            return ResourcesGeneratorService.getResource('lightning/closechannel').post({nodeid: nodeid}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getRoute = function (nodeid, amount, riskFactor) {
            return ResourcesGeneratorService.getResource('lightning/getroute').post({
                nodeid: nodeid,
                amount: amount,
                riskFactor: riskFactor
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.createInvoice = function (amount, label) {
            return ResourcesGeneratorService.getResource('lightning/createinvoice').post({
                amount: amount,
                label: label
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listInvoices = function () {
            return ResourcesGeneratorService.getResource('lightning/listinvoice').query().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.deleteInvoice = function (label) {
            return ResourcesGeneratorService.getResource('lightning/invoice/:label').delete({label: label}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.sendPay = function (route, rhash) {
            return ResourcesGeneratorService.getResource('lightning/sendpay').post({
                route: route,
                hash: rhash
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
