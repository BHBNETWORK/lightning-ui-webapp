'use strict';

/**
 * @ngdoc overview
 * @name App
 * @description
 * # App
 *
 * Main module of the application.
 */
angular
    .module('App', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngMaterial',
        'angularMoment',
        'ngclipboard'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/wallet', {
                templateUrl: 'views/wallet.html',
                controller: 'WalletCtrl'
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($mdThemingProvider) {
        var newGreenMap = $mdThemingProvider.extendPalette('green', {
            '500': '#26D03A',
            contrastDefaultColor: 'dark',
            contrastLightColors: ['50', '100', '200', '300', '400', 'A100']
        });
        $mdThemingProvider.definePalette('newGreen', newGreenMap);

        $mdThemingProvider.theme('default')
            .primaryPalette('newGreen')
            .accentPalette('light-blue')
            .warnPalette('amber')
            .dark();

        $mdThemingProvider.enableBrowserColor({
            theme: 'default'
        });
    })
    .config(function (ConfigProvider) {
        ConfigProvider.serverHost = 'http://127.0.0.1:9000/api';
    })
    .run(function ($rootScope, SettingsService) {
        $rootScope.SettingsService = SettingsService;
        return SettingsService.getRemoteSettings();
    });
