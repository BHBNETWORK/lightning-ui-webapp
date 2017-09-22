'use strict';

/**
 * @ngdoc function
 * @name App.controller:InvoicesWidgetCtrl
 * @description
 * # InvoicesWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('InvoicesWidgetCtrl', function ($interval, LightningService, $mdToast) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;

        this.loading = false;
        this.lastUpdate = null;

        this.invoices = [];

        this.update = function () {
            _self.loading = true;

            LightningService.listInvoices()
                .then(function (response) {
                    _self.invoices = response;
                    _self.lastUpdate = new Date();
                    _self.loading = false;
                })
                .catch(function () {
                    _self.loading = false;
                });
        };

        this.copiedToClipboard = function () {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Copied to clipboard!')
                    .position('bottom right')
                    .hideDelay(2500)
            );
        };

        this.update();
        $interval(this.update, UPDATE_DELAY);
    });
