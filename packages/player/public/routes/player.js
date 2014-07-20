'use strict';

angular.module('mean.player').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('player example page', {
            url: '/player/example',
            templateUrl: 'player/views/index.html'
        });
    }
]);
