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

        var getServerPathPromise = $q.resolve(Config.getServerPath());
        if (!Config.getServerPath()) {
            var confirm = $mdDialog.prompt()
                .title('Select a lightning-ui server')
                .textContent('Don\'t forget the trailing \'/api\'')
                .placeholder('https://my.local.node/api')
                .ariaLabel('Server URL')
                .required(true)
                .ok('Done!');

            getServerPathPromise = $mdDialog.show(confirm)
                .then(function (result) {
                    // save the result in localStorage
                    window.localStorage.setItem('serverHost', result);

                    return result;
                }, function () {
                    console.warn(arguments);
                });
        }

        this.getResource = function (path) {
            return getServerPathPromise
                .then(function (serverPath) {
                    if (serverPath[serverPath.length - 1] !== '/') {
                        serverPath += '/'; // append final slash
                    }

                    return $resource(serverPath + path, {}, {
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
                });
        };

        this.successHandler = function (response) {
            return response;
        };

        this.failureHandler = function (errorResponse) {
            $rootScope.$emit('loading-stop');

            var errorString = null;
            if (errorResponse && errorResponse.data && errorResponse.data.error && errorResponse.data.error.message && typeof errorResponse.data.error.message === typeof ('string')) {
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
