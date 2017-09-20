'use strict';

/**
 * @ngdoc function
 * @name App.controller:MyWalletWidgetCtrl
 * @description
 * # MyWalletWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MyWalletWidgetCtrl', function ($q, $interval, BitcoinService) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;

        this.loading = false;
        this.lastUpdate = null;

        this.address = '';
        this.confirmedBalance = 0;
        this.unconfirmedBalance = 0;

        this.update = function (newAddr) {
            _self.loading = true;

            var promises = [
                BitcoinService.getConfirmedBalance(),
                BitcoinService.getUnconfirmedBalance()
            ];

            if (newAddr) {
                promises.push(BitcoinService.getNewAddress());
            }

            $q.all(promises)
                .then(function (response) {
                    _self.confirmedBalance = response[0].balance;
                    _self.unconfirmedBalance = response[1].balance;

                    if (newAddr) {
                        _self.address = response[2].address;
                    }

                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function () {
                    _self.loading = false;
                });
        };

        this.update(true);
        this.updateInterval = $interval(this.update, UPDATE_DELAY, 0, true, false);

        this.stopUpdating = function () {
            $interval.cancel(_self.updateInterval);
        }
    });
