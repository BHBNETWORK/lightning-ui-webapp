'use strict';

/**
 * @ngdoc function
 * @name App.service:SettingsService
 * @description
 * # SettingsService
 * Service of the App
 */
angular.module('App')
    .service('SettingsService', function (ResourcesGeneratorService) {
        var settings = {};

        this.get = function (key) {
            if (!(key in settings)) {
                throw 'invalid_key';
            }

            return settings[key];
        };

        this.getRemoteSettings = function () {
            return ResourcesGeneratorService.getResource('settings').get().$promise
                .then(function (response) {
                        settings = response;
                        return settings;
                    },
                    ResourcesGeneratorService.failureHandler);
        };

        this.updateSettings = function (settingsObject) {
            return ResourcesGeneratorService.getResource('settings').put(settingsObject).$promise
                .then(function () {
                    settings = settingsObject;
                    return settings;
                }, ResourcesGeneratorService.failureHandler);
        };
    });
