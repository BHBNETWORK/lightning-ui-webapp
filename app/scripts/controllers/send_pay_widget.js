'use strict';

/**
 * @ngdoc function
 * @name App.controller:SendPayWidgetCtrl
 * @description
 * # SendPayWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SendPayWidgetCtrl', function ($q, LightningService, $scope, $rootScope) {
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

        $rootScope.$on('new-payment-recipient', function (_, peerid) {
            _self.payment.nodeid = peerid;
        });

        this.calculatingRoute = false;

        this.submit = function () {
            var routePromise = $q.resolve();

            if (_self.payment.autoRoute) {
                _self.calculatingRoute = true;

                routePromise = LightningService.getRoute(_self.payment.nodeid, _self.payment.amount, _self.payment.riskFactor)
                    .then(function (route) {
                        _self.payment.route = JSON.stringify(route.route);
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
                    _self.payment = null;
                    _self.payment.autoRoute = true;
                    _self.payment.riskFactor = 1;

                    $scope.sendPayForm.$setPristine();
                    $scope.sendPayForm.$setUntouched();
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
