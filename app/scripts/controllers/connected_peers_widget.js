'use strict';

/**
 * @ngdoc function
 * @name App.controller:ConnectedPeersWidgetCtrl
 * @description
 * # ConnectedPeersWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('ConnectedPeersWidgetCtrl', function ($interval, LightningService, $mdToast, $mdDialog, $rootScope) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;

        this.loading = false;
        this.lastUpdate = null;

        this.peers = [];

        this.update = function () {
            _self.loading = true;

            LightningService.getPeers()
                .then(function (response) {
                    _self.peers = response.peers;

                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function () {
                    _self.loading = false;
                });
        };

        this.copiedToClipboard = function () {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Copied to clipboard!')
                    .position('top right')
                    .hideDelay(2500)
            );
        };

        this.showConfirm = function (ev, nodeid, index) {
            var confirm = $mdDialog.confirm()
                .title('Do you really want to close this channel?')
                .textContent('You are about to close your channel with ' + nodeid)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function () {
                    return LightningService.closeChannel(nodeid);
                })
                .then(function () {
                    _self.peers.splice(index, 1);
                })
                .catch(function () {
                }); // Do nothing
        };

        this.showBalance = function (ev, nodeid, index) {
            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/balance_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    items: {
                        nodeid: nodeid,
                        /*jshint -W069 */
                        msatoshiToUs: _self.peers[index]['msatoshi_to_us'],
                        msatoshiToPeer: _self.peers[index]['msatoshi_total'] - _self.peers[index]['msatoshi_to_us'],
                        msatoshiTotal: _self.peers[index]['msatoshi_total'],
                        /*jshint +W069 */
                        status: _self.peers[index].status
                    }
                }
            })
                .catch(function () {
                }); // do nothing
        };

        this.addPeer = function (ev) {
            var newNode = {
                ip: '',
                port: 10000,
                nodeid: '',
                amount: 0
            };

            function resetNewNode() {
                newNode.ip = '';
                newNode.port = 10000;
                newNode.nodeid = '';
                newNode.amount = 0;
            }

            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/new_peer_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    items: {
                        newNode: newNode,
                        confirmNewNode: function (ev) {
                            $rootScope.$emit('loading-start', ev);

                            LightningService.openChannel(newNode.ip, newNode.port, newNode.nodeid, newNode.amount)
                                .then(function () {
                                    _self.update();
                                })
                                .catch(function (err) {
                                    console.warn(err);
                                })
                                .finally(function () {
                                    $rootScope.$emit('loading-stop');
                                    resetNewNode();
                                });
                        }
                    }
                }
            })
                .catch(resetNewNode); // reset the values
        };

        this.update();
        $interval(this.update, UPDATE_DELAY);
    });
