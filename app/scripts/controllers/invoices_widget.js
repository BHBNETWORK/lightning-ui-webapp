'use strict';

/**
 * @ngdoc function
 * @name App.controller:InvoicesWidgetCtrl
 * @description
 * # InvoicesWidgetCtrl
 * Controller of the App
 */
angular.module('App')
    .controller('InvoicesWidgetCtrl', function ($interval, LightningService, $mdToast, $mdDialog, SettingsService) {
        var _self = this;

        var UPDATE_DELAY = 120 * 1000;
        var updateInterval = null;

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

        this.deleteInvoice = function (ev, label, index) {
            var confirm = $mdDialog.confirm()
                .title('Do you really want to delete this invoice?')
                .textContent('You are about to delete ' + label)
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm)
                .then(function () {
                    return LightningService.deleteInvoice(label);
                })
                .then(function () {
                    _self.invoices.splice(index, 1);
                })
                .catch(function () {
                }); // Do nothing
        };

        this.newInvoice = function (ev) {
            var newInvoice = {
                label: '',
                amount: 0
            };

            function resetNewInvoice() {
                newInvoice.label = '';
                newInvoice.amount = 0;
            }

            $mdDialog.show({
                controller: 'DialogCtrl',
                templateUrl: 'views/new_invoice_dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    items: {
                        newInvoice: newInvoice,
                        SettingsService: SettingsService,
                        confirm: function () {
                            _self.loading = true;

                            console.log(newInvoice.amount);
                            LightningService.createInvoice(newInvoice.amount, newInvoice.label)
                                .then(function (rhash) {
                                    _self.update();

                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent('Invoice rhash: ' + rhash.rhash)
                                            .highlightAction(true)
                                            .position('bottom right')
                                            .hideDelay(false)
                                            .action('Close')
                                    );
                                })
                                .catch(function (err) {
                                    console.warn(err);
                                })
                                .finally(function () {
                                    _self.loading = false;
                                    resetNewInvoice();
                                });

                            return true;
                        }
                    }
                }
            })
                .catch(resetNewInvoice); // reset the values
        };

        this.update();
        updateInterval = $interval(this.update, UPDATE_DELAY);

        this.$destroy = function () {
            $interval.cancel(updateInterval);
        };
    });
