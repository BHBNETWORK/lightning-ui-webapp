'use strict';

/**
 * @ngdoc service
 * @name App.UnitConversionService
 * @description
 * # UnitConversionService
 * Service in the App.
 */
angular.module('App')
    .service('UnitConversionService', function () {
        var conversionRates = {
            'XBT': 1e8,
            'SAT': 1,
            'mSAT': 1e-3
        };

        this.convert = function (value, from, to) {
            return value * conversionRates[from] / conversionRates[to];
        };
    });
