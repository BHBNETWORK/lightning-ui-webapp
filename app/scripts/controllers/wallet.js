'use strict';

/**
 * @ngdoc function
 * @name App.controller:WalletCtrl
 * @description
 * # WalletCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('WalletCtrl', function ($scope, $rootScope, $location, $q, BitcoinService, LightningService, $mdToast, $mdDialog, SettingsService, UnitConversionService) {
        $rootScope.$emit('page-title', 'BHB ⚡️ Wallet');

        $scope.addfunds = {
            amount: '',
            autorawtx: true,
            rawtx: '',
            creatingTx: false,
            loading: false
        };

        $scope.withdraw = {
            amount: '',
            address: '',
            autoaddress: true,
            generatingAddress: false,
            loading: false
        };

        $scope.peers = [];
        $scope.loadingPeers = false;

        function resetAddFunds() {
            $scope.addfunds = {
                amount: '',
                autorawtx: true,
                rawtx: '',
                creatingTx: false,
                loading: false
            };

            $scope.addFundsForm.$setPristine();
            $scope.addFundsForm.$setUntouched();
        }

        function resetWithdraw() {
            $scope.withdraw = {
                amount: '',
                autoaddress: true,
                generatingAddress: false,
                loading: false
            };

            $scope.withdrawForm.$setPristine();
            $scope.withdrawForm.$setUntouched();
        }

        $scope.refreshPeers = function () {
            $scope.loadingPeers = true;

            return LightningService.listPeers()
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
            if ($scope.addfunds.autorawtx) {
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
                    var convertedValue = UnitConversionService.convert(response.satoshis, 'SAT', SettingsService.get('unit'));

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Added ' + convertedValue + ' ' + SettingsService.get('unit') + ' to your Lightning wallet')
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

        $scope.confirmWithdraw = function () {
            // TODO: alert(?)

            $scope.withdraw.loading = true;

            var addressPromise = $q.resolve({address: $scope.withdraw.address});
            if ($scope.withdraw.autoaddress) {
                $scope.withdraw.generatingAddress = true;

                addressPromise = BitcoinService.getNewAddress()
                    .finally(function () {
                        $scope.withdraw.generatingAddress = false;
                    });
            }

            addressPromise
                .then(function (address) {
                    return LightningService.withdraw($scope.withdraw.amount, address.address);
                })
                .then(function (response) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Created transacton #' + response.txid)
                            .highlightAction(true)
                            .position('bottom right')
                            .hideDelay(false)
                            .action('Close')
                    );

                    resetWithdraw();
                })
                .finally(function () {
                    $scope.withdraw.loading = false;
                });
        };

        $scope.fundChannel = function (ev, peerid) {
            var setAmount = $mdDialog.prompt()
                .title('Choose the amount of ' + SettingsService.get('unit') + ' to move')
                .htmlContent('<p>Set the amount of ' + SettingsService.get('unit') + ' you want to move into the channel with <span class="code height-2-2">' + peerid + '</span></p>')
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
                .then(function () {
                    return $scope.refreshPeers();
                })
                .finally(function () {
                    $scope.loadingPeers = false;
                });
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
