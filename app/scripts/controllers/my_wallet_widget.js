'use strict';

/**
 * @ngdoc function
 * @name App.controller:MyWalletWidgetCtrl
 * @description
 * # MyWalletWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MyWalletWidgetCtrl', function ($q, $interval, LightningService) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;
        var updateInterval = null;

        this.loading = false;
        this.lastUpdate = null;

        this.lightningAddress = '';
        this.lightningFunds = 0;

        this.updateAddress = function () {
            if ('undefined' === typeof (window.localStorage.lightningAddress)) {
                LightningService.getNewAddress()
                    .then(function (response) {
                        window.localStorage.lightningAddress = _self.lightningAddress = response.address;
                    })
                    .catch(function (err) {
                        console.log(JSON.stringify(err));
                    });
            }
            else {
                _self.lightningAddress = window.localStorage.lightningAddress;
            }
        };

        this.update = function () {
            _self.loading = true;

            _self.updateAddress();

            LightningService.getFundsSum()
                .then(function (response) {
                    _self.lightningFunds = response;

                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function (err) {
                  console.log (JSON.stringify (err));
                  _self.loading = false;
                });
        };

        this.newLightningAddress = function () {
            LightningService.getNewAddress()
                .then(function (response) {
                    window.localStorage.lightningAddress = _self.lightningAddress = response.address;
                })
                .catch(function (err) {
                    console.log (JSON.stringify (err));
                });
        };

        this.update();
        updateInterval = $interval(this.update, UPDATE_DELAY, 0, true, false);

        this.$destroy = function () {
            $interval.cancel(updateInterval);
        };
    });
