'use strict';

/**
 * @ngdoc function
 * @name App.directive:myWalletWidget
 * @description
 * # myWalletWidget
 * Directive of the App
 */
angular.module('App')
    .directive('myWalletWidget', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/my_wallet.html',
            controller: 'MyWalletWidgetCtrl',
            controllerAs: 'ctrlWallet',
            bindToController: true,
            link: function (scope) {
                scope.$on('$destroy', function () {
                    scope.ctrlWallet.$destroy();
                });
            }
        };
    });
