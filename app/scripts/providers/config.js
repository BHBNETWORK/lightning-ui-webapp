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

        this.$get = function () {
            var obj = this;
            return {
                getServerPath: function () {
                    if (!obj.serverHost) {
                        return false;
                    }

                    return obj.serverHost + '/';
                }
            };
        };
    });
