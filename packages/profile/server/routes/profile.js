'use strict';

var profile = require('../controllers/profile');

// Video authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.profile._id !== req.user._id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Profile, app, auth, database) {

    app.route('/profile')
      .get(auth.requiresLogin,profile.me);
      

   	app.route('/profile/videos')
      .get(auth.requiresLogin,profile.subscribedVideos); 

    app.route('/profile/:profileId')
      .get(profile.show);

    app.route('/profile/:profileId').put(auth.requiresLogin, hasAuthorization, profile.update);

    app.route('/profile/follow/:profileId')
      .post(auth.requiresLogin, profile.follow)
      .put(auth.requiresLogin, profile.unfollow);

    app.param('profileId', profile.profile);
};
