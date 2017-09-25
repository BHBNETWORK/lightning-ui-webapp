'use strict';

/**
 * @ngdoc function
 * @name App.controller:SendPayWidgetCtrl
 * @description
 * # SendPayWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SendPayWidgetCtrl', function ($q, LightningService) {
        var _self = this;

        this.loading = false;
        this.payment = {
            route: '',
            rhash: '',
            autoRoute: true,
            nodeid: '',
            amount: null,
            riskFactor: 1
        };

        this.calculatingRoute = false;

        this.submit = function () {
            var routePromise = $q.resolve();

            if (_self.payment.autoRoute) {
                _self.calculatingRoute = true;

                routePromise = LightningService.getRoute(_self.payment.nodeid, _self.payment.amount, _self.payment.riskFactor)
                    .then(function (route) {
                        _self.payment.route = JSON.stringify(route);
                    })
                    .finally(function () {
                        _self.calculatingRoute = false;
                    });
            }

            routePromise
                .then(function () {
                    _self.loading = true;

                    return LightningService.sendPay(JSON.parse(_self.payment.route), _self.payment.rhash);
                })
                .then(function () {
                    _self.payment.route = '';
                    _self.payment.rhash = '';
                    _self.payment.nodeid = '';
                    _self.payment.amount = null;
                })
                .catch(function (error) {
                    console.warn(error);
                })
                .finally(function () {
                    _self.loading = false;
                });
        };

        this.$destroy = function () {
        };
    });
