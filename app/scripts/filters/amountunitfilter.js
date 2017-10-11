'use strict';

/**
 * @ngdoc filter
 * @name App.filter:AmountUnitFilter
 * @function
 * @description
 * # AmountUnitFilter
 * Filter in the App.
 */
angular.module('App')
    .filter('AmountUnitFilter', function (SettingsService, UnitConversionService) {
        return function (amount, valueUnit, printUnit) {
            if (printUnit !== false) {
                printUnit = true;
            }

            if (typeof amount !== 'number' || isNaN(amount)) {
                return '-';
            }

            var convertedAmount = UnitConversionService.convert(amount, valueUnit, SettingsService.get('unit'));
            if (SettingsService.get('unit') === 'XBT') {
                convertedAmount = convertedAmount.toFixed(8);
            }

            return convertedAmount + (printUnit ? ' ' + SettingsService.get('unit') : '');
        };
    });
