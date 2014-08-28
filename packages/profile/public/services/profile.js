'use strict';

angular.module('mean.profile').factory('Profile', ['$resource',
	function($resource) {
		return $resource('profile/:profileId', {
			profileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			subscribedVideos:{
				method: 'GET',url:'profile/videos', isArray:true
			},
			follow: {
				method: 'POST',url:'profile/follow/:profileId', isArray:false
			},
			unfollow: {
				method: 'PUT',url:'profile/follow/:profileId', isArray:false
			}
		});
	}
]);