'use strict';

/**
 * @ngdoc directive
 * @name App.directive:amountUnitConverter
 * @description
 * # amountUnitConverter
 */
angular.module('App')
    .directive('amountUnitConverter', function (SettingsService, UnitConversionService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    var convertedInput = 0;

                    if (typeof inputValue === 'number' && !isNaN(inputValue)) {
                        convertedInput = UnitConversionService.convert(inputValue, SettingsService.get('unit'), scope.amountUnitConverter);
                    }

                    modelCtrl.$setViewValue(inputValue);
                    modelCtrl.$render();

                    return convertedInput;
                });
            },
            scope: {
                amountUnitConverter: '@'
            }
        };
    });
