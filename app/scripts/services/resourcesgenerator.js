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
            var prompt = $mdDialog.prompt()
                .title('Select a lightning-ui server')
                .textContent('Don\'t forget the trailing \'/api\'')
                .placeholder('https://my.local.node/api')
                .ariaLabel('Server URL')
                .required(true)
                .ok('OK');

            var tempServerHost = '';

            var checkForHTTPS = function (result) {
                tempServerHost = result;

                var confirm = $q.resolve();
                if (!result.startsWith('https://')) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('You are not using https')
                        .textContent('This setup is not safe - you could loose funds. ' +
                            'Do you want to proceed anyways?')
                        .ariaLabel('Confirm unsecure HTTP')
                        .ok('Proceed')
                        .cancel('Cancel');

                    confirm = $mdDialog.show(confirmDialog);
                }

                return confirm;
            };

            var saveServerHost = function () {
                // save the result in localStorage
                window.localStorage.setItem('serverHost', tempServerHost);
                return tempServerHost;
            };

            var catchErrors = function () {
                return $mdDialog.show(prompt).then(checkForHTTPS).then(saveServerHost)
                    .catch(catchErrors);
            };

            getServerPathPromise = $mdDialog.show(prompt).then(checkForHTTPS).then(saveServerHost)
                .catch(catchErrors);
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
