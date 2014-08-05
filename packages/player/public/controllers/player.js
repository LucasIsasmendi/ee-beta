'use strict';

angular.module('mean.player').controller('PlayerController', ['$scope','$sce', 'Global', 'Player','PlayerHelper','$location','$stateParams',
    function($scope,$sce, Global, Player,PlayerHelper,$location,$stateParams) {
        $scope.global = Global;       

       $scope.video = {};
        $scope.hasAuthorization = function(video) {
            if (!video || !video.user) return false;
            return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
        };

        $scope.findOne = function(){
        	Player.get({
                videoId: $stateParams.videoId
            }, function(video) {
                $scope.video = video;
                $scope.video.video_url = '';
                if(video.external==='youtube.com'){
					$scope.video.video_url = PlayerHelper.getYoutubePlayer($scope.video.location);
                }
            });
        };

        $scope.addComment = function(isValid) {

            if (isValid) {
            	
                var comment = new Player($scope.commentRequest);
                comment.$comment({
                	videoId: $stateParams.videoId
            		},function(response) {
            			$scope.video.comments.push(response);
                });

                $scope.commentRequest = {};
            } else {
                $scope.submitted = true;
            }
        };

        $scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

        $scope.goBack = function(argument) {
        	 $location.path('');
        };
    }
]);
