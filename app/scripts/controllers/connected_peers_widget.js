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
        var updateInterval = null;

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
                    .position('bottom right')
                    .hideDelay(2500)
            );
        };

        this.showConfirm = function (ev, nodeid) {
            var confirm = $mdDialog.confirm()
                .title('Do you really want to close this channel?')
                .htmlContent('<p>You are about to close your channel with <span class="code height-2-2">' + nodeid + '</span></p>')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function () {
                    return LightningService.closeChannel(nodeid);
                })
                .catch(function () {
                }); // Do nothing
        };

        this.connect = function (ev, nodeid, netaddr) {
            var splitIndex = netaddr.lastIndexOf(':');
            var address = netaddr.slice(0, splitIndex);
            var port = netaddr.slice(splitIndex);

            _self.loading = true;
            LightningService.connect(address, port, nodeid)
                .finally(function () {
                    _self.update();
                    _self.loading = false;
                });
        };

        this.getIcon = function (peerState) {
            var icons = {
                'GOSSIPD': 'cloud',
                'OPENINGD': 'rss_feed',
                'CHANNELD_AWAITING_LOCKIN': 'done',
                'CHANNELD_NORMAL': 'done_all',
                'CHANNELD_SHUTTING_DOWN': 'close',
                'CLOSINGD_SIGEXCHANGE': 'compare_arrows'
            };

            return icons[peerState] || 'help_outline';
        };

        this.peerInfoDialog = function (ev, nodeid, index) {
            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/peer_info_dialog.html',
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
                        connectionStatus: _self.peers[index].state
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
                nodeid: ''
            };

            function resetNewNode() {
                newNode.ip = '';
                newNode.port = 10000;
                newNode.nodeid = '';
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

                            LightningService.connect(newNode.ip, newNode.port, newNode.nodeid)
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
        updateInterval = $interval(this.update, UPDATE_DELAY);

        this.$destroy = function () {
            $interval.cancel(updateInterval);
        };
    });
