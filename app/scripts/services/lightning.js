'use strict';

/**
 * @ngdoc function
 * @name App.service:LightningService
 * @description
 * # LightningService
 * Service of the App
 */
angular.module('App')
    .service('LightningService', function (ResourcesGeneratorService) {
        this.getInfo = function () {
            return ResourcesGeneratorService.getResource('lightning/getinfo').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
