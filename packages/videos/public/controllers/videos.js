'use strict';

angular.module('mean.videos').controller('VideosHomeController', ['$scope','$http','$stateParams', 'Global', 'Videos',
    function($scope,$http,$stateParams, Global, Videos) {
        $scope.global = Global;
        $scope.categories={'Fun':'Fun','Sports':'Sports','Other':'Other'};
        $scope.videoSearchReq = {};
        $scope.videosList = [];
        $scope.hasAuthorization = function(video) {
            if (!video || !video.user) return false;
            return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
        };
        $scope.videoSearch = function(isValid){
        	if (isValid) {
        		Videos.search($scope.videoSearchReq,function(videos) {
	                $scope.videosList = videos;
	            });
        	}
        };

        $http.get('videos/taglist').success(function(data) {
            $scope.tagList = data;
        });
        if($stateParams.category) $scope.activeCategory = $stateParams.category;
        
}]);

angular.module('mean.videos').controller('VideosListController', ['$scope', 'Global', 'Videos','$location',
    function($scope, Global, Videos,$location) {
        $scope.global = Global;
        $scope.videosList = [];
        Videos.query(function(videos) {
            $scope.videosList = videos;
        });

}]);

angular.module('mean.videos').controller('VideosListManageController', ['$scope', 'Global', 'Videos','$location',
    function($scope, Global, Videos,$location) {
        $scope.global = Global;
        $scope.videosList = [];
        Videos.userlist(function(videos) {
	     	$scope.videosList = videos;
	    });

        $scope.remove = function(video) {
          if (video) {
            video.$remove();
            for (var i in $scope.videosList) {
              if ($scope.videosList[i] === video) {
                $scope.videosList.splice(i, 1);
              }
            }
          } else {
            $scope.video.$remove(function(response) {
              $location.path('videos');
            });
          }
        };
}]);

angular.module('mean.videos').controller('VideosTagController', ['$scope','$stateParams', 'Global', 'Videos',
    function($scope,$stateParams, Global, Videos) {
        $scope.activeTag = $stateParams.tag;
        Videos.tags({tag:$stateParams.tag},function(videos) {
            $scope.videosList = videos;
        });
}]);

angular.module('mean.videos').controller('VideosCategoryController', ['$scope','$stateParams', 'Global', 'Videos',
    function($scope,$stateParams, Global, Videos) {
        
        Videos.categories({category:$stateParams.category},function(videos) {
            $scope.videosList = videos;
        });
}]);

angular.module('mean.videos').controller('VideosCreateController', ['$scope','$sce', 'Global', 'Videos','VideoHelper','$location','$stateParams',
    function($scope,$sce, Global, Videos,VideoHelper,$location,$stateParams) {
        $scope.global = Global;
        $scope.package = {
            name: 'videos'
        };
        $scope.videoRequest ={};
        $scope.videoRequest.fileType ='video/mp4';

        $scope.uploadFile = false;

        $scope.hasAuthorization = function(video) {
            if (!video || !video.user) return false;
            return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
        };

        $scope.submitForm = function(isValid) {

            if (isValid) {
                $scope.videoRequest.tags = $scope.videoRequest.tags.split(',');
            	var domainName= VideoHelper.getDomainName($scope.videoRequest.location);
            	if(domainName==='youtube.com'){
            		$scope.videoRequest.thumb = VideoHelper.getYoutubeThumb($scope.videoRequest.location);
            	}
                var video = new Videos($scope.videoRequest);
                video.$save(function(response) {
                    $location.path('player/' + response._id);
                });

                $scope.videoRequest = {};
            } else {
                $scope.submitted = true;
            }
        };

        $scope.editForm = function(isValid) {
            if (isValid) {
            	var domainName= VideoHelper.getDomainName($scope.videoRequest.location);
            	if(domainName==='youtube.com'){
            		$scope.videoRequest.thumb = VideoHelper.getYoutubeThumb($scope.videoRequest.location);
            	}
                var video = $scope.videoRequest;

                video.$update(function() {
                    $location.path('player/' + video._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.uploadedVideo = function(files){
            $scope.videoRequest.location = files[0].src;
            $scope.videoRequest.fileType = files[0].type;
            $scope.uploadFile = true;
        };

        $scope.findOne = function(){
        	Videos.get({
                videoId: $stateParams.videoId
            }, function(video) {
                $scope.video = video;
                $scope.video.video_url = '';
                switch(video.external){
                    case 'outube.com':
                        $scope.video.video_url = VideoHelper.getYoutubePlayer($scope.video.location);
                    break;
                    case '':
                        $scope.uploadFile = true;
                    break;
                }
               
                $scope.videoRequest = angular.copy($scope.video);
            });
        };

        $scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};

        $scope.goBack = function(argument) {
        	 $location.path('');
        };
    }
]);
