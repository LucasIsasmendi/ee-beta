'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Video Schema
 */
var VideoSchema = new Schema({
    added: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location:{
    	type: String,
        required: true,
    },
    fileType:{
        type: String,
        default: 'video/mp4',
    },
    thumb:{
        type: String,
        default: '/videos/assets/img/video.jpg',
    },
    external:{
        type: String,
        default: 'local'
    },
    public: {
    	type : Boolean, 
    	default : false
    },
    publish: {
    	type : Boolean, 
    	default : false
    },
    tags: [String],
    categories: [String],
    view_count :{
    	type: Number,
    	default: 0
    },
    stats:{
        likes:{
            type: Number,
            default: 0
        },
        dislikes:{
            type: Number,
            default: 0
        },
        shares:{
            facebook:{
                type: Number,
                default: 0
            },
            twitter:{
                type: Number,
                default: 0
            },
            gplus:{
                type: Number,
                default: 0
            }
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    enable_comments: {
        type : Boolean, 
        default : true
    },
    comments: [{
    	type: Schema.ObjectId,
    	ref: 'Comment'
    }]
});

/**
 * Validations
 */
VideoSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');


/**
 * Statics
 */
VideoSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').populate('comments').exec(cb);
};

mongoose.model('Video', VideoSchema);


var CommenSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    date:  { 
    	type: Date, 
    	default: Date.now 
    }, 
    comment:  {
        type: String,
        required: true,
        trim: true
    },
    stats:{
        likes:{
            type: Number,
            default: 0
        },
        dislikes:{
            type: Number,
            default: 0
        }
    }
});

CommenSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Comment', CommenSchema);