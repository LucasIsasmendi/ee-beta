'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Video = mongoose.model('Video'),
    Comment = mongoose.model('Comment'),
    fs = require('fs'),
    _ = require('lodash');


/**
 * Find video by id
 */
exports.video = function(req, res, next, id) {
    Video.findOne({
        _id: id
    }).populate('user', 'name username').populate('comments').exec(function (err, video) {
        Comment.populate(video,{
            path:'comments.user',
            select:'username',
            model:'User'
        },function(err, video) {
            if (err) return next(err);
            if (!video) return next(new Error('Failed to load video ' + id));
            video.view_count = video.view_count+1;
            video.save();
            req.video = video;
            next();
        });
    });
    
};

/**
 * Create an video
 */
exports.create = function(req, res) {
    var video = new Video(req.body);
    video.user = req.user;
    video.external = req.body.location.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
    video.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot save the video'
            });
        }

        var sourceStream = fs.createReadStream(video._doc.location);
        var destPath = process.cwd() + '/public/uploads/';
        var destName = video._doc._id.toHexString();
        var destinationFile = destPath + destName;
        var destStream = fs.createWriteStream(destinationFile);
        sourceStream
          .on('error', function(error) {
            console.error('Problem copying file: ' + error.stack);
            return res.json(525, {
              error: 'Cannot copy the file'
            });
          })
          .on('end', function() {res.json(video);})
          .pipe(destStream);

    });
};

/**
 * Update an video
 */
exports.update = function(req, res) {
    var video = req.video;

    video = _.extend(video, req.body);
    video.external = req.body.location.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
    video.save(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot update the video'
            });
        }
        res.json(video);

    });
};

/**
 * Delete an video
 */
exports.destroy = function(req, res) {
    var video = req.video;

    video.remove(function(err) {
        if (err) {
            return res.json(500, {
                error: 'Cannot delete the video'
            });
        }
        res.json(video);

    });
};

/**
 * Show an video
 */
exports.show = function(req, res) {
    res.json(req.video);
};

/**
 * List of Videos
 */
exports.all = function(req, res) {
    var where = {};
    var selects ='added title description location thumb external tags categories stats view_count,enable_comments';
    if(req.user.hasRole('admin')){
        selects ='added title description location thumb external tags categories stats view_count publish';

    }
    else{
        where = {$or : [{user: req.user._id}, {public: true}]};
        selects ='added title description location thumb external tags categories stats view_count,enable_comments';
    }
    
    Video.find(where).sort('-added')
    .select(selects)
    .populate('user', 'name username').exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });   
};

exports.userVideos = function(req, res) {
    var user_id = (req.query.userId) ? req.query.userId : req.user._id;
    Video.find({user: user_id}).sort('-added')
    .populate('user', 'name username').exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });   
};

exports.searchAll = function(req, res) {
    Video.find({ $and: [
            {$or : [{user: req.user._id}, {public: true}]},
            {$or : [{title: { $regex: req.query.word }}, {description: { $regex: req.query.word }}]},
            ]}).sort('-added')
    .select('added title description location thumb external tags categories stats view_count')
    .populate('user', 'name username').exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });
};

exports.taggedVideos = function(req, res) {
    Video.find({ $and: [
            {$or : [{user: req.user._id}, {public: true}]},
            {$and : [{tags: req.query.tag }]},
            ]}).sort('-added')
    .select('added title description location thumb external tags categories stats view_count')
    .populate('user', 'name username').exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });
};

exports.categoryVideos = function(req, res) {
    Video.find({ $and: [
            {$or : [{user: req.user._id}, {public: true}]},
            {$and : [{categories: req.query.category}]},
            ]}).sort('-added')
    .select('added title description location thumb external tags categories stats view_count')
    .populate('user', 'name username').exec(function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the videos'
            });
        }
        res.json(videos);

    });
};

exports.tagList = function(req, res) {
     Video.distinct('tags', function(err, videos) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the tags'
            });
        }
        res.json(videos);
    });
};

exports.videoComments = function(req, res) {
    Video.findOne({_id:req.video_id})
    .populate('comments').exec(function(err, video) {
        if (err) {
            return res.json(500, {
                error: 'Cannot list the comments'
            });
        }
        res.json(video);

    });
};

exports.addComment = function(req, res) {
    var video = req.video;
    var comment = new Comment(req.body);
    comment.user = req.user;
    comment.save();
    video.comments.push(comment);
    video.save(function(err) {
       
        res.json(comment);

    });
};