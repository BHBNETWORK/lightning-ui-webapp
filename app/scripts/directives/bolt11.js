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
                return typeof value === 'object' && value !== null;
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

                if (result) {
                    result.parsedDescription = null;
                    result.fallbackAddress = null;

                    var mapTags = {
                        'description': 'parsedDescription',
                        'fallback_address': 'fallbackAddress',
                        'expire_time': 'expireTime',
                        'purpose_commit_hash': 'descriptionHash'
                    };

                    // We could sort and bsearch but honestly I don't think it's worth for so few tags
                    result.tags.forEach(function (tag) {
                        if (Object.keys(mapTags).indexOf(tag.tagName) > -1) {
                            result[mapTags[tag.tagName]] = tag.data;
                        }
                    });
                }

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
