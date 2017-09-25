'use strict';

/**
 * @ngdoc function
 * @name App.controller:WalletCtrl
 * @description
 * # WalletCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('WalletCtrl', function ($scope, $rootScope, $location, $q, BitcoinService, LightningService, $mdToast) {
        $rootScope.$emit('page-title', 'Wallet');

        $scope.addfunds = {
            amount: 0,
            autorawtx: true,
            rawtx: '',
            creatingTx: false
        };

        function resetAddFunds() {
            $scope.addfunds.amount = 0;
            $scope.addfunds.autorawtx = false;
            $scope.addfunds.rawtx = '';
            $scope.addfunds.creatingTx = false;
        }

        $scope.confirmAddFunds = function () {
            // TODO: alert(?)

            var rawTxPromise = $q.resolve({rawtx: $scope.addfunds.rawtx});
            if (!$scope.addfunds.rawtx) {
                $scope.addfunds.creatingTx = true;

                rawTxPromise = LightningService.getNewAddress()
                    .then(function (addr) {
                        return BitcoinService.sendToAddress(addr.address, ($scope.addfunds.amount / 1e8).toFixed(8));
                    })
                    .then(function (txid) {
                        return BitcoinService.getRawTransaction(txid.txid);
                    })
                    .finally(function () {
                        $scope.addfunds.creatingTx = false;
                    });
            }

            rawTxPromise
                .then(function (rawtx) {
                    return LightningService.addFunds(rawtx.rawtx);
                })
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Added ' + response.satoshis + ' SAT to your Lightning wallet')
                            .highlightAction(true)
                            .position('bottom right')
                            .hideDelay(false)
                            .action('Close')
                    );

                    resetAddFunds();
                });
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
