'use strict';

/**
 * @ngdoc function
 * @name App.service:SettingsService
 * @description
 * # SettingsService
 * Service of the App
 */
angular.module('App')
    .service('SettingsService', function (ResourcesGeneratorService, $q) {
        var settings = {};

        var getSettingsPromise = $q.reject({});

        this.get = function (key) {
            if (!(key in settings)) {
                return null;
            }

            return settings[key];
        };

        this.getAllSettings = function () {
            return getSettingsPromise;
        };

        this.getRemoteSettings = function () {
            getSettingsPromise = ResourcesGeneratorService.getResource('settings')
                .then(function (resource) {
                    return resource.get().$promise;
                })
                .then(function (response) {
                        settings = response;
                        return settings;
                    },
                    ResourcesGeneratorService.failureHandler);

            return getSettingsPromise;
        };

        this.updateSettings = function (settingsObject) {
            return ResourcesGeneratorService.getResource('settings')
                .then(function (resource) {
                    return resource.put(settingsObject).$promise;
                })
                .then(function () {
                    settings = settingsObject;
                    return settings;
                }, ResourcesGeneratorService.failureHandler);
        };
    });
