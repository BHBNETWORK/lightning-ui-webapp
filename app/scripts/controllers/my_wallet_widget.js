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

        this.updateAddresses = function (){
            const updateAddress = function (address, service){
                if ('undefined' === typeof (window.localStorage [address])){
                    const promises = [service.getNewAddress()];
                    $q.all(promises)
                        .then(function (response) {
                            window.localStorage [address] = _self [address] = response[0].address;
                        })
                        .catch(function (err) {
                            console.log (JSON.stringify (err));
                        });
                }
                else{
                    _self [address] = window.localStorage [address];
                }
            };
            updateAddress ('bitcoinAddress', BitcoinService);
            updateAddress ('lightningAddress', LightningService);
        };

        this.update = function () {
            _self.loading = true;

            var promises = [
                BitcoinService.getConfirmedBalance(),
                BitcoinService.getUnconfirmedBalance(),
                LightningService.getFundsSum()
            ];

            this.updateAddresses ();

            $q.all(promises)
                .then(function (response) {
                    _self.confirmedBalance = response[0].balance * 1e8;
                    _self.unconfirmedBalance = response[1].balance * 1e8;
                    _self.lightningFunds = response[2];

                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function (err) {
                  console.log (JSON.stringify (err));
                  _self.loading = false;
                });
        };
        this.newBitcoinAddress = function(){
            const promises = [
                BitcoinService.getNewAddress()
            ];

            $q.all(promises)
                .then(function (response) {
                    _self.bitcoinAddress = response[0].address;
                })
                .catch(function (err) {
                    console.log (JSON.stringify (err));
                });
        };

        this.newLightningAddress = function(){
            const promises = [
                LightningService.getNewAddress()
            ];

            $q.all(promises)
                .then(function (response) {
                    _self.lightningAddress = response[0].address;
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
