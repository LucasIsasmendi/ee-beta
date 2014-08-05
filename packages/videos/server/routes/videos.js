'use strict';

var videos = require('../controllers/videos');

// Video authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.video.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};


module.exports = function(Videos, app, auth) {
    app.get('/videos/search', auth.requiresLogin, videos.searchAll);
    app.get('/videos/tags', auth.requiresLogin, videos.taggedVideos);
    app.get('/videos/taglist', auth.requiresLogin, videos.tagList);
    app.get('/videos/categories', auth.requiresLogin, videos.categoryVideos);
    app.get('/videos/userlist', auth.requiresLogin, videos.userVideos);
    //app.get('/videos/categorylist', auth.requiresLogin, videos.categoryList);
    app.route('/videos')
        .get(videos.all)
        .post(auth.requiresLogin, videos.create);
    app.route('/videos/:videoId')
        .get(videos.show)
        .put(auth.requiresLogin, hasAuthorization, videos.update)
        .delete(auth.requiresLogin, hasAuthorization, videos.destroy);

    app.route('/videos/comment/:videoId')
        .post(auth.requiresLogin, videos.addComment);

    // Finish with setting up the videoId param
    app.param('videoId', videos.video);
};
