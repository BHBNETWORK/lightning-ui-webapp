'use strict';

/**
 * @ngdoc function
 * @name App.controller:ToolbarCtrl
 * @description
 * # ToolbarCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('ToolbarCtrl', function ($scope, $mdSidenav, $rootScope) {
        var buttonClickEvent = null;
        $scope.pageTitle = '';

        $rootScope.$on('page-title', function (_, title) {
            $scope.pageTitle = title;
            document.getElementsByTagName('title')[0].innerHTML = title;
        });

        $scope.openSidenav = function () {
            $mdSidenav('left').open();
        };

        $scope.hide = false;
        $scope.loading = false;

        $rootScope.$on('toolbar-hide', function () {
            $scope.hide = true;
        });

        $rootScope.$on('toolbar-toggle', function () {
            $scope.hide = !$scope.hide;
        });

        $rootScope.$on('toolbar-show', function () {
            $scope.hide = false;
        });

        $rootScope.$on('loading-start', function (eventObject, clickEvent) {
            if (clickEvent) {
                buttonClickEvent = clickEvent;
            }

            $scope.loading = true;
        });

        $rootScope.$on('loading-stop', function () {
            $scope.loading = false;
        });

        $rootScope.$on('loading-toggle', function () {
            $scope.loading = !$scope.loading;
        });

        $rootScope.getClickEvent = function () {
            return buttonClickEvent;
        };
    });
