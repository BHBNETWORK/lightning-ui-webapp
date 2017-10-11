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
                    var originalInputValue = inputValue;

                    if (typeof inputValue !== 'number') {
                        if (inputValue[inputValue.length - 1] === '.') {
                            inputValue = inputValue.slice(0, -1);
                        }

                        try {
                            inputValue = parseFloat(inputValue);
                        } catch (e) {
                            inputValue = 0;
                        }
                    }

                    var convertedInput = 0;
                    if (!isNaN(inputValue)) {
                        convertedInput = UnitConversionService.convert(inputValue, SettingsService.get('unit'), scope.amountUnitConverter);
                    }

                    modelCtrl.$setViewValue(originalInputValue);
                    modelCtrl.$render();

                    return convertedInput;
                });
            },
            scope: {
                amountUnitConverter: '@'
            }
        };
    });
