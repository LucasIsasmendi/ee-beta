'use strict';

angular.module('mean.player').factory('Player', ['$resource',
	function($resource) {
		return $resource('videos/:videoId', {
			videoId: '@_id'
		},{
			comment:{
				method:'POST',url:'videos/comment/:videoId'
			}
		});
	}
]);

angular.module('mean.player').service('PlayerHelper', ['$location',
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