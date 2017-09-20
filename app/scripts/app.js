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
        'angularMoment'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($mdThemingProvider) {
        var newGreenMap = $mdThemingProvider.extendPalette('green', {
            '500': '#2e7d32',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('newGreen', newGreenMap);

        var newOrangeMap = $mdThemingProvider.extendPalette('orange', {
            'A200': '#f4511e',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('newOrange', newOrangeMap);

        var newPinkMap = $mdThemingProvider.extendPalette('pink', {
            '500': '#e91e63',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider.definePalette('newPink', newPinkMap);

        $mdThemingProvider.theme('default')
            .primaryPalette('newGreen')
            .accentPalette('newOrange')
            .warnPalette('newPink');

        $mdThemingProvider.enableBrowserColor({
            theme: 'default'
        });
    })
    .config(function (ConfigProvider) {
        ConfigProvider.serverHost = 'http://127.0.0.1:19000/api';
    });
