'use strict';

/**
 * @ngdoc function
 * @name App.service:BitcoinService
 * @description
 * # BitcoinService
 * Service of the App
 */
angular.module('App')
    .service('BitcoinService', function (ResourcesGeneratorService) {
        this.getInfo = function () {
            return ResourcesGeneratorService.getResource('bitcoin/getinfo').get().$promise
                .then(ResourcesGeneratorService.successHandler, ResourcesGeneratorService.failureHandler);
        };
    });
