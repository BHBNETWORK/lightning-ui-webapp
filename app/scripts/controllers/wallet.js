'use strict';

/**
 * @ngdoc function
 * @name App.controller:WalletCtrl
 * @description
 * # WalletCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('WalletCtrl', function ($scope, $rootScope, $location, $q, BitcoinService, LightningService, $mdToast, $mdDialog) {
        $rootScope.$emit('page-title', 'Wallet');

        $scope.addfunds = {
            amount: 0,
            autorawtx: true,
            rawtx: '',
            creatingTx: false,
            loading: false
        };

        $scope.peers = [];
        $scope.loadingPeers = false;

        function resetAddFunds() {
            $scope.addfunds.amount = 0;
            $scope.addfunds.autorawtx = false;
            $scope.addfunds.rawtx = '';
            $scope.addfunds.creatingTx = false;
        }

        $scope.refreshPeers = function () {
            $scope.loadingPeers = true;

            LightningService.getPeers()
                .then(function (list) {
                    $scope.peers = list.peers;
                })
                .finally(function () {
                    $scope.loadingPeers = false;
                });
        };

        $scope.refreshPeers();

        $scope.confirmAddFunds = function () {
            // TODO: alert(?)

            $scope.addfunds.loading = true;

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
                })
                .finally(function () {
                    $scope.addfunds.loading = false;
                });
        };

        $scope.fundChannel = function (ev, peerid) {
            var setAmount = $mdDialog.prompt()
                .title('Choose the amount of satoshi to move')
                .htmlContent('<p>Set the amount of satoshi you want to move into the channel with <span class="code height-2-2">' + peerid + '</span></p>')
                .placeholder('Amount')
                .initialValue(0)
                .targetEvent(ev)
                .required(true)
                .ok('Move the funds')
                .cancel('Cancel');

            $mdDialog.show(setAmount)
                .then(function (amount) {
                    $scope.loadingPeers = true;
                    return LightningService.fundChannel(peerid, amount);
                })
                .then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Done!')
                            .highlightAction(true)
                            .position('bottom right')
                            .hideDelay(false)
                            .action('Close')
                    );
                })
                .finally(function () {
                    $scope.loadingPeers = false;
                });
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
