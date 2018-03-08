'use strict';

/**
 * @ngdoc directive
 * @name App.directive:amountUnitConverter
 * @description
 * # amountUnitConverter
 */

var bolt11 = require('bolt11');

angular.module('App')
    .directive('bolt11', function () {
        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.bolt11 = function (value) {
                return typeof value === 'object' && value !== null && value.complete;
            };

            ngModel.$parsers.push(function (value) {
                var result = null;
                var originalInputValue = value;

                try {
                    result = bolt11.decode(value);
                } catch (err) {
                }

                ngModel.$setViewValue(originalInputValue);
                ngModel.$render();

                return result;
            });
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel',
            scope: {}
        };
    });
