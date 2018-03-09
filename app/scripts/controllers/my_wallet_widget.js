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

            const promises = [
                BitcoinService.getConfirmedBalance(),
                BitcoinService.getUnconfirmedBalance(),
                LightningService.getFundsSum()
            ];

            _self.updateAddresses ();

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

        this.newAddress = function (address, service){
            const promises = [
                service.getNewAddress()
            ];

            $q.all(promises)
                .then(function (response) {
                    window.localStorage [address] = _self [address] = response[0].address;
                })
                .catch(function (err) {
                    console.log (JSON.stringify (err));
                });
        };

        this.newBitcoinAddress = function(){
            _self.newAddress ('bitcoinAddress', BitcoinService);
        };

        this.newLightningAddress = function(){
            _self.newAddress ('lightningAddress', LightningService);
        };

        this.update();
        updateInterval = $interval(this.update, UPDATE_DELAY, 0, true, false);

        this.$destroy = function () {
            $interval.cancel(updateInterval);
        };
    });
