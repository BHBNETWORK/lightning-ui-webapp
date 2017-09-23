'use strict';

/**
 * @ngdoc function
 * @name App.directive:invoicesWidget
 * @description
 * # invoicesWidget
 * Directive of the App
 */
angular.module('App')
    .directive('invoicesWidget', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/invoices.html',
            controller: 'InvoicesWidgetCtrl',
            controllerAs: 'ctrlInvoices',
            bindToController: true
        };
    });
