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
        var _self = this;

        this.getInfo = function () {
            return ResourcesGeneratorService.getResource('lightning/getinfo').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listPeers = function () {
            return ResourcesGeneratorService.getResource('lightning/listpeers').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listNodes = function () {
            return ResourcesGeneratorService.getResource('lightning/listnodes').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listChannels = function () {
            return ResourcesGeneratorService.getResource('lightning/listchannels').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getNewAddress = function () {
            return ResourcesGeneratorService.getResource('lightning/getnewaddress').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.openChannel = function (hostname, port, nodeid, amount) {
            return ResourcesGeneratorService.getResource('lightning/openchannel').post({
                ip: hostname,
                port: port,
                nodeid: nodeid,
                amount: amount
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.connect = function (hostname, port, nodeid) {
            return ResourcesGeneratorService.getResource('lightning/connect').post({
                ip: hostname,
                port: port,
                nodeid: nodeid
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addFunds = function (rawtx) {
            return ResourcesGeneratorService.getResource('lightning/addfunds').post({rawtx: rawtx}).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.fundChannel = function (nodeid, amount) {
            return ResourcesGeneratorService.getResource('lightning/fundchannel').post({
                nodeid: nodeid,
                amount: amount
            }).$promise
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

        this.withdraw = function (amount, address) {
            console.log(amount, address);
            return ResourcesGeneratorService.getResource('lightning/withdraw').post({
                amount: amount,
                address: address
            }).$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listInvoices = function () {
            return ResourcesGeneratorService.getResource('lightning/listinvoices').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listFunds = function () {
            return ResourcesGeneratorService.getResource('lightning/listfunds').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getFundsSum = function () {
            return _self.listFunds()
                .then(function (array) {
                    var sum = 0;

                    array.outputs.forEach(function (output) {
                        sum += output.value;
                    });

                    return sum;
                });
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
