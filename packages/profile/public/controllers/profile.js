'use strict';

angular.module('mean.profile').controller('ProfileCtrl', ['$scope', 'Global', 'Profile', 'Videos',
  function($scope, Global, Profile, Videos) {
    $scope.global = Global;
    $scope.package = {
      name: 'profile'
    };
    $scope.profile = {};
    $scope.findMe = function(){
    	Profile.get(function(user) {
            $scope.profile = user;
        });
    	Videos.userlist(function(videos){
    		$scope.profile.videos = videos;
    	});
    };

    $scope.subscribedVideos = function(){
        Profile.subscribedVideos(function(videos){
            $scope.subscribeVideoList= videos;
        });
    };

    $scope.submitProfile = function(isValid) {

        if (isValid) {
            
            var profile = new Profile($scope.profile);
            profile.$update(function(response) {
            });

        } else {
            $scope.submitted = true;
        }
    };

    $scope.uploadPhoto = function(files){
        $scope.profile.photo = files[0].src;
    };

  }
]);


angular.module('mean.profile').controller('ProfileViewCtrl', ['$scope', '$stateParams', 'Global', 'Profile', 'Videos',
  function($scope, $stateParams, Global, Profile, Videos) {
    $scope.isOwner = false;

    $scope.user ={};
    $scope.profile = {};
    Profile.get(function(user) {
            $scope.user = user;
    });
    $scope.findUser = function(){
    	Profile.get({profileId:$stateParams.profileId},function(user) {
            $scope.profile = user;
            if ($scope.profile._id === $scope.user._id) {$scope.isOwner = true;}
            if($scope.user.following.indexOf($scope.profile._id) === -1){
                $scope.shouldFollow= true;
            }
        });
    	Videos.userlist({userId:$stateParams.profileId},function(videos){
    		$scope.uservideos = videos;
    	});
    };

    $scope.followUser = function(){
        var profile = new Profile();
        profile.$follow({profileId:$stateParams.profileId},function(user) {
            $scope.profile = user; 
            $scope.shouldFollow= false;
        });
    };

    $scope.unfollowUser = function(){
        var profile = new Profile();
        profile.$unfollow({profileId:$stateParams.profileId},function(user) {
            $scope.profile = user; 
            $scope.shouldFollow= true;
        });
    };


  }
]);