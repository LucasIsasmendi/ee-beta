'use strict';

//Setting up route
angular.module('mean.videos').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('videos', {
                url: '/videos',
                templateUrl: 'videos/views/index.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.all', {
                url: '/list',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/list.html',
                        controller : 'VideosListController'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.my', {
                url: '/manage',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/managelist.html',
                        controller : 'VideosListManageController'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.tag', {
                url: '/tag/{tag}',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/list.html',
                        controller : 'VideosTagController'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.category', {
                url: '/category/{category}',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/list.html',
                        controller : 'VideosCategoryController'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.create', {
                url: '/create',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/create.html'
                    }
                },
                title : 'Upload your video and share with the world!',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.edit', {
                url: '/:videoId/edit',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/edit.html'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos.view', {
                url: '/:videoId',
                views: {
                    'videos-view':{
                        templateUrl : 'videos/views/view.html'
                    }
                },
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
