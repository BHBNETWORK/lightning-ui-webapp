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
            'XBT': 1e11,
            'SAT': 1e3,
            'mSAT': 1
        };

        this.convert = function (value, from, to) {
            return Math.round(value * conversionRates[from]) / conversionRates[to];
        };
    });
