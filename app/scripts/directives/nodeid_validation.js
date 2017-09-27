'use strict';

/**
 * @ngdoc function
 * @name App.directive:nodeidValidation
 * @description
 * # nodeidValidation
 * Directive of the App
 */
angular.module('App')
    .directive('nodeidValidation', function () {
        function link(scope, element, attrs, ngModel) {
            ngModel.$validators.nodeidValidation = function (value) {
                return typeof value === 'string' && value.length === 66;
            };
        }

        return {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
    });
