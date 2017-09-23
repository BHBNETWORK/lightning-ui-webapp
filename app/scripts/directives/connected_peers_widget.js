'use strict';

/**
 * @ngdoc function
 * @name App.directive:connectedPeersWidget
 * @description
 * # connectedPeersWidget
 * Directive of the App
 */
angular.module('App')
    .directive('connectedPeersWidget', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/connected_peers.html',
            controller: 'ConnectedPeersWidgetCtrl',
            controllerAs: 'ctrlConnectedPeers',
            bindToController: true
        };
    });
