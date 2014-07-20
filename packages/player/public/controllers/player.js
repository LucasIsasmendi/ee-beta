'use strict';

angular.module('mean.player').controller('PlayerController', ['$scope', 'Global', 'Player',
    function($scope, Global, Player) {
        $scope.global = Global;
        $scope.package = {
            name: 'player'
        };
    }
]);
