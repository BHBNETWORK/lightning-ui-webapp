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
            return ResourcesGeneratorService.getResource('lightning/getinfo')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listPeers = function () {
            return ResourcesGeneratorService.getResource('lightning/listpeers')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listNodes = function () {
            return ResourcesGeneratorService.getResource('lightning/listnodes')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listChannels = function () {
            return ResourcesGeneratorService.getResource('lightning/listchannels')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getNewAddress = function () {
            return ResourcesGeneratorService.getResource('lightning/getnewaddress')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.openChannel = function (hostname, port, nodeid, amount) {
            return ResourcesGeneratorService.getResource('lightning/openchannel')
                .then(function (resource) {
                    return resource.post({
                        ip: hostname,
                        port: port,
                        nodeid: nodeid,
                        amount: amount
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.connect = function (hostname, port, nodeid) {
            return ResourcesGeneratorService.getResource('lightning/connect')
                .then(function (resource) {
                    return resource.post({
                        ip: hostname,
                        port: port,
                        nodeid: nodeid
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.addFunds = function (rawtx) {
            return ResourcesGeneratorService.getResource('lightning/addfunds')
                .then(function (resource) {
                    return resource.post({rawtx: rawtx}).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.fundChannel = function (nodeid, amount) {
            return ResourcesGeneratorService.getResource('lightning/fundchannel')
                .then(function (resource) {
                    return resource.post({
                        nodeid: nodeid,
                        amount: amount
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.closeChannel = function (nodeid) {
            return ResourcesGeneratorService.getResource('lightning/closechannel')
                .then(function (resource) {
                    return resource.post({nodeid: nodeid}).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.getRoute = function (nodeid, amount, riskFactor) {
            return ResourcesGeneratorService.getResource('lightning/getroute')
                .then(function (resource) {
                    return resource.post({
                        nodeid: nodeid,
                        amount: amount,
                        riskFactor: riskFactor
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.createInvoice = function (amount, label) {
            return ResourcesGeneratorService.getResource('lightning/createinvoice')
                .then(function (resource) {
                    return resource.post({
                        amount: amount,
                        label: label
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.withdraw = function (amount, address) {
            console.log(amount, address);
            return ResourcesGeneratorService.getResource('lightning/withdraw')
                .then(function (resource) {
                    return resource.post({
                        amount: amount,
                        address: address
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listInvoices = function () {
            return ResourcesGeneratorService.getResource('lightning/listinvoices')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.listFunds = function () {
            return ResourcesGeneratorService.getResource('lightning/listfunds')
                .then(function (resource) {
                    return resource.get().$promise;
                })
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
            return ResourcesGeneratorService.getResource('lightning/invoice/:label')
                .then(function (resource) {
                    return resource.delete({label: label}).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.sendPay = function (route, rhash) {
            return ResourcesGeneratorService.getResource('lightning/sendpay')
                .then(function (resource) {
                    return resource.post({
                        route: route,
                        hash: rhash
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };

        this.pay = function (payreq, msatoshi, description, riskfactor, maxfeepercent) {
            return ResourcesGeneratorService.getResource('lightning/pay')
                .then(function (resource) {
                    return resource.post({
                        payreq: payreq,
                        msatoshi: msatoshi,
                        description: description,
                        riskfactor: riskfactor,
                        maxfeepercent: maxfeepercent
                    }).$promise;
                })
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
