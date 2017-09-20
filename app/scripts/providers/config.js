'use strict';

/**
 * @ngdoc function
 * @name App.provider:Config
 * @description
 * # Config
 * Provider of the App
 */
angular.module('App')
    .provider('Config', function () {
        this.serverHost = null;

        var exceptionStringValue = 'Uninitialized config server values';

        this.$get = function () {
            var obj = this;
            return {
                getServerPath: function () {
                    if (!obj.serverHost) {
                        throw exceptionStringValue;
                    }

                    return obj.serverHost + '/';
                }
            };
        };
    });
