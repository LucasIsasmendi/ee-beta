'use strict';

//Videos service used for videos REST endpoint
angular.module('mean.videos').factory('Videos', ['$resource',
	function($resource) {
		return $resource('videos/:videoId', {
			videoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			query: {
				method:'GET', isArray:true
			},
			search: {
				method:'GET',url:'videos/search', isArray:true
			},
			userlist: {
				method:'GET',url:'videos/userlist', isArray:true
			},
			tags: {
				method:'GET',url:'videos/tags', isArray:true
			},
			categories: {
				method:'GET',url:'videos/categories', isArray:true
			}
		});
	}
]);

angular.module('mean.videos').service('VideoHelper', ['$location',
	function($location) {

		this.getYoutubePlayer = function(url){
        	return 'https://www.youtube.com/embed/'+this.getYouTubeID(url); 
        };

        this.getYoutubeThumb = function(url){
        	return 'http://img.youtube.com/vi/'+this.getYouTubeID(url)+'/2.jpg';
        };

        this.getYouTubeID = function(url){
		  	var ID = '';
		  	url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		  	if(url[2] !== undefined) {
			    ID = url[2].split(/[^0-9a-z_]/i);
			    ID = ID[0];
			}
			else {
			    ID = url;
			}
			return ID;
		};

		this.getDomainName = function(url){
        	return url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
        };

	}
]);