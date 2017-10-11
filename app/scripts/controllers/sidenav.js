'use strict';

/**
 * @ngdoc function
 * @name App.controller:SidenavCtrl
 * @description
 * # SidenavCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SidenavCtrl', function ($scope, $mdMedia, $mdDialog, $mdSidenav, $mdTheming, $mdMenu, $location, $rootScope) {
        $scope.closed = false;
        $rootScope.$on('sidenav-close', function () {
            $scope.closed = true;
        });

        $rootScope.$on('sidenav-toggle', function () {
            $scope.closed = !$scope.closed;
        });

        $rootScope.$on('sidenav-open', function () {
            $scope.closed = false;
        });

        $scope.menuEntries = [
            {
                title: 'Dashboard',
                icon: 'home',
                link: '/'
            },
            {
                title: 'Wallet',
                icon: 'account_balance_wallet',
                link: '/wallet'
            },
            {
                title: 'Settings',
                icon: 'settings',
                link: '/settings'
            }
        ];

        $scope.handleClick = function (entry, event) {
            if (entry.link) {
                $scope.goTo(entry.link);
            } else if (typeof entry.callback === 'function') {
                entry.callback(entry, event);
            }

            $mdSidenav('left').close();
        };

        $scope.goTo = function (path) {
            $location.path(path);
            $mdSidenav('left').close();
        };
    });
