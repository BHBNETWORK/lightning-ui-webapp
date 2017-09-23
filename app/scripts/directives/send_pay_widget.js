'use strict';

/**
 * @ngdoc function
 * @name App.directive:sendPayWidget
 * @description
 * # sendPayWidget
 * Directive of the App
 */
angular.module('App')
    .directive('sendPayWidget', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/send_pay.html',
            controller: 'SendPayWidgetCtrl',
            controllerAs: 'ctrlSendPay',
            bindToController: true,
            link: function (scope) {
                scope.$on('$destroy', function () {
                    scope.ctrlSendPay.$destroy();
                });
            }
        };
    });
