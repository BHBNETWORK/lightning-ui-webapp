'use strict';

/**
 * @ngdoc function
 * @name App.controller:MyWalletWidgetCtrl
 * @description
 * # MyWalletWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('MyWalletWidgetCtrl', function ($q, $interval, BitcoinService, LightningService) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;
        var updateInterval = null;

        this.loading = false;
        this.lastUpdate = null;

        this.lightningAddress = '';
        this.bitcoinAddress = '';
        this.confirmedBalance = 0;
        this.unconfirmedBalance = 0;
        this.lightningFunds = 0;

        this.update = function (newAddr) {
            _self.loading = true;

            var promises = [
                BitcoinService.getConfirmedBalance(),
                BitcoinService.getUnconfirmedBalance(),
                LightningService.getFundsSum()
            ];

            if (newAddr) {
                promises.push(LightningService.getNewAddress());
                promises.push(BitcoinService.getNewAddress());
            }

            $q.all(promises)
                .then(function (response) {
                    _self.confirmedBalance = response[0].balance * 1e8;
                    _self.unconfirmedBalance = response[1].balance * 1e8;
                    _self.lightningFunds = response[2];

                    if (newAddr) {
                        _self.lightningAddress = response[3].address;
                        _self.bitcoinAddress = response[4].address;
                    }

                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function () {
                    _self.loading = false;
                });
        };

        this.update(true);
        updateInterval = $interval(this.update, UPDATE_DELAY, 0, true, false);

        this.$destroy = function () {
            $interval.cancel(updateInterval);
        };
    });
