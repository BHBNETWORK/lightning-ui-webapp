'use strict';

/**
 * @ngdoc function
 * @name App.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SettingsCtrl', function ($scope, $rootScope, $location, $mdToast, SettingsService) {
        $rootScope.$emit('page-title', 'Settings');

        $scope.loading = false;
        $scope.currentSettings = SettingsService.getAllSettings();

        $scope.validUnits = ['XBT', 'SAT', 'mSAT'];

        $scope.save = function () {
            $scope.loading = true;
            SettingsService.updateSettings($scope.currentSettings)
                .then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Settings saved!')
                            .position('bottom right')
                            .hideDelay(3000)
                    );

                    $scope.loading = false;
                });
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };
    });
