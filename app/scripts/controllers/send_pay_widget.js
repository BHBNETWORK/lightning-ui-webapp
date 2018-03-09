'use strict';

/**
 * @ngdoc function
 * @name App.controller:SendPayWidgetCtrl
 * @description
 * # SendPayWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SendPayWidgetCtrl', function ($q, LightningService, $scope, $rootScope, $interval) {
        var _self = this;

        this.mode = 'bolt11';

        this.loading = false;
        this.payment = {
            route: '',
            rhash: '',
            autoRoute: true,
            nodeid: '',
            amount: null,
            riskFactor: 1
        };

        this.bolt11 = {
            payreq: null,
            msatoshi: null,
            description: null,
            riskfactor: 1.0,
            maxfeepercent: 0.5,

            disableSubmit: false,
            timeLeft: 0,
            interval: null
        };

        $rootScope.$on('new-payment-recipient', function (_, peerid) {
            _self.payment.nodeid = peerid;
        });

        this.calculatingRoute = false;

        this.submitAdvanced = function () {
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

        this.submitBOLT11 = function () {
            _self.loading = true;

            LightningService.pay(
                _self.bolt11.payreq.paymentRequest,
                _self.bolt11.msatoshi,
                _self.bolt11.description,
                _self.bolt11.riskfactor,
                _self.bolt11.maxfeepercent
                )
                .then(function () {
                    _self.bolt11.payreq = null;

                    _self.bolt11.disableSubmit = false;
                    $interval.cancel(_self.bolt11.interval);

                    $scope.sendPayForm.$setPristine();
                    $scope.sendPayForm.$setUntouched();
                })
                .catch(function (error) {
                    console.warn(error);
                    return $q.reject(error);
                })
                .finally(function () {
                    _self.loading = false;
                });
        };

        this.submit = function () {
            if (_self.mode === 'bolt11') {
                return _self.submitBOLT11();
            } else if (_self.mode === 'advanced') {
                return _self.submitAdvanced();
            }

            throw 'Unknown payment mode';
        };

        this.switchMode = function () {
            _self.mode = (_self.mode === 'bolt11') ? 'advanced' : 'bolt11';
            _self.bolt11.payreq = null;

            _self.bolt11.disableSubmit = false;
            $interval.cancel(_self.bolt11.interval);
        };

        $scope.$watch('ctrlSendPay.bolt11.payreq', function (newVal) {
            _self.bolt11.disableSubmit = false;
            _self.bolt11.timeLeft = newVal ? (newVal.expireTime || 0) : 0;

            if (newVal && newVal.expireTime) {
                var timeLeft = _self.bolt11.timeLeft = Math.max(_self.bolt11.payreq.timestamp + _self.bolt11.payreq.expireTime - Math.floor(Date.now() / 1000), 0);

                if (timeLeft > 0) {
                    _self.bolt11.interval = $interval(function () {
                        _self.bolt11.timeLeft = --timeLeft;
                    }, 1000, timeLeft);
                } else {
                    // already expired
                    _self.bolt11.interval = $q.resolve();
                    _self.bolt11.timeLeft = 0;
                }

                _self.bolt11.interval
                    .then(function () {
                        // timeout reached the end
                        _self.bolt11.disableSubmit = true;
                    })
                    .catch(function () {
                        // timeout cancelled
                        _self.bolt11.timeLeft = 0;
                        _self.bolt11.disableSubmit = false;
                        _self.bolt11.interval = null;
                    });
            } else {
                $interval.cancel(_self.bolt11.interval);
            }
        });

        this.$destroy = function () {
        };
    });
