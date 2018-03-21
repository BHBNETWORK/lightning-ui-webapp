'use strict';

/**
 * @ngdoc function
 * @name App.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('SettingsCtrl', function ($scope, $rootScope, $location, $mdDialog, $mdToast, SettingsService) {
        $rootScope.$emit('page-title', 'BHB ⚡️ Settings');

        $scope.loading = true;
        SettingsService.getAllSettings()
            .then(function (settings) {
                $scope.currentSettings = settings;
            })
            .finally(function () {
                $scope.loading = false;
            });

        $scope.validUnits = ['XBT', 'SAT', 'mSAT'];

        $scope.disconnectFromServer = function (ev) {
            var confirm = $mdDialog.confirm()
                .title('Do you really want to disconnect?')
                .textContent('You will be asked for a new lightning-ui server address the next time you\'ll come back')
                .ariaLabel('Confirm disconnection')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function () {
                    window.localStorage.removeItem('serverHost');
                    window.location.reload();
                });
        };

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
