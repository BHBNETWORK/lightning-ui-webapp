'use strict';

/**
 * @ngdoc function
 * @name App.directive:routeValidation
 * @description
 * # routeValidation
 * Directive of the App
 */
angular.module('App')
    .directive('routeValidation', function () {
        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.routeValidation = function (value) {
                if (scope.disableRouteValidation) {
                    return true;
                }

                try {
                    var parsedObj = JSON.parse(value);
                    return Array.isArray(parsedObj) &&
                        parsedObj.every(function (i) {
                            return i.hasOwnProperty('id') &&
                                i.hasOwnProperty('channel') &&
                                i.hasOwnProperty('msatoshi') &&
                                i.hasOwnProperty('delay');
                        });
                } catch (err) {
                    return false;
                }
            };
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            scope: {
                disableRouteValidation: '='
            }
        };
    });
