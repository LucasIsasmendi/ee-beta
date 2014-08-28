'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    User = mongoose.model('User'),
    _ = require('lodash');


exports.me = function(req, res,next) {
  User
    .findOne({
      _id: req.user._id
    }).select('name email username description photo gender followers following')
    .exec(function(err, user) {
      if (err) return next(err);
      res.json(user);
    });
};

/**
 * Find user by id
 */
exports.profile = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    }).select('name email username description photo gender followers following')
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Show user
 */
exports.show = function(req, res) {
    res.json(req.profile);
};

exports.update = function(req, res, next, id) {
    var user = req.profile;
    user = _.extend(user, req.body);
    user.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the user'
            });
        }
        res.json(user);

    });
};

exports.follow = function(req, res) {
    var user = req.user;
    var index = user.following.indexOf(req.profile._id);
    if(index === -1) user.following.push(req.profile);
    user.save(function(err) {});

    var profile = req.profile;
    var index2 = profile.followers.indexOf(req.user._id);
    if(index2 === -1) profile.followers.push(req.user);
    profile.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the data'
            });
        }
        res.json(profile);
    });
};

exports.unfollow = function(req, res) {
    var user = req.user;
    var index = user.following.indexOf(req.profile._id);
    if(index !== -1) user.following.splice(index,1);
    user.save(function(err) {});

    var profile = req.profile;
    var index2 = profile.followers.indexOf(req.user._id);
    if(index2 !== -1) profile.followers.splice(index2,1);
    profile.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the data'
            });
        }
        res.json(profile);
    });
};

/**
    * find user videos
*/
exports.userVideos = function(req, res) {
    
    Video.find({user: req.profile._id}).exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });   
};

exports.subscribedVideos = function(req, res) {
     User
    .findOne({
      _id: req.user._id
    }).select('name email username description photo gender followers following')
    .exec(function(err, user) {
        Video.where('user').in(user.following).populate('user','username').exec(function(err, videos) {
            if (err) {
                return res.json(500, {
                    error: 'Cannot list the videos'
                });
            }
            res.json(videos);

        });   
    });
    
};