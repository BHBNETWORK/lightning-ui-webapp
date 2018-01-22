'use strict';

/**
 * @ngdoc function
 * @name App.service:ResourcesGeneratorService
 * @description
 * # ResourcesGeneratorService
 * Service of the App
 */
angular.module('App')
    .service('ResourcesGeneratorService', function ($resource, $q, $mdDialog, $rootScope, Config) {
        var DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred, please try again later';
        var lastErrorPopup = $q.resolve();

        this.getResource = function (path) {
            return $resource(Config.getServerPath() + path, {}, {
                'get': {method: 'GET'},
                'save': {method: 'POST'},
                'post': {method: 'POST'},
                'put': {
                    method: 'PUT', params: {
                        /* paramName: '@paramName' */
                    }
                },
                'query': {method: 'GET', isArray: true},
                'remove': {method: 'DELETE'},
                'delete': {method: 'DELETE'}
            });
        };

        this.successHandler = function (response) {
            return response;
        };

        this.failureHandler = function (errorResponse) {
            $rootScope.$emit('loading-stop');

            var errorString = null;
            if (errorResponse && errorResponse.data && errorResponse.data.error && errorResponse.data.error.message && typeof errorResponse.data.error.message === typeof ('string') ) {
                errorString = errorResponse.data.error.message;
            }

            if (lastErrorPopup.$$state.status === 0) {
                return;
            }

            lastErrorPopup = $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('An error occurred')
                    .textContent(errorString || DEFAULT_ERROR_MESSAGE)
                    .ariaLabel('Error message')
                    .ok('Close')
                    .targetEvent($rootScope.getClickEvent())
                    .theme($rootScope.theme)
            )
                .then(function () {
                    return $q.reject(errorString || errorResponse);
                });

            return lastErrorPopup;
        };
    });
