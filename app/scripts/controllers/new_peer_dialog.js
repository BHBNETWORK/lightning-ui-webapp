'use strict';

/**
 * @ngdoc function
 * @name App.controller:NewPeerDialogCtrl
 * @description
 * # NewPeerDialogCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('NewPeerDialogCtrl', function ($scope, $mdDialog, items, LightningService, $rootScope, $q) {
        $scope.mode = items.mode || 'connection-string';
        $scope.newNode = {};

        function generateString(nodeid, ip, port) {
            var str = nodeid + '@' + ip;

            if (port) {
                str += ':' + port;
            }

            return str;
        }

        $scope.resetNewNode = function () {
            $scope.newNode = {
                ip: items.ip || '',
                port: items.port || 9735,
                nodeid: items.nodeid || '',
                string: (items.nodeid && items.ip) ? generateString(items.nodeid, items.ip, items.port) : ''
            };
        };

        $scope.resetNewNode();

        $scope.close = function () {
            $mdDialog.cancel();
        };

        $scope.toggleMode = function () {
            if ($scope.mode === 'connection-string') {
                $scope.mode = 'advanced';
            } else {
                $scope.mode = 'connection-string';
            }
        };

        function parseConnectionString() {
            var parts = $scope.newNode.string.split('@');

            if (parts.length !== 2) {
                return $q.reject('Invalid connection string');
            }

            $scope.newNode.nodeid = parts[0];

            parts = parts[1].split(':');

            $scope.newNode.port = parts[1] || 9735;
            $scope.newNode.ip = parts[0];

            return $q.resolve();
        }

        $scope.confirm = function (ev) {
            $rootScope.$emit('loading-start', ev);

            var parsePromise = $q.resolve();
            if ($scope.mode === 'connection-string') {
                parsePromise = parseConnectionString();
            }

            parsePromise
                .then(function () {
                    return LightningService.connect($scope.newNode.ip, $scope.newNode.port, $scope.newNode.nodeid);
                })
                .then(function () {
                    items.connected_peers_ctrl.update();
                })
                .catch(function (err) {
                    console.warn(err);
                })
                .finally(function () {
                    $rootScope.$emit('loading-stop');

                    $scope.resetNewNode();
                    $scope.close();
                });
        };
    });
