'use strict';

/**
 * @ngdoc function
 * @name App.directive:sha256Verify
 * @description
 * # sha256Verify
 * Directive of the App
 */
angular.module('App')
    .directive('sha256Verify', function ($window) {
        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.sha256Verify = function (value) {
                return typeof value === 'string' && $window.sha256(value) === scope.sha256Verify;
            };
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            scope: {
                sha256Verify: '<'
            }
        };
    });
