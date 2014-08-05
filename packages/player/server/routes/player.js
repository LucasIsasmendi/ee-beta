'use strict';
var mime = require('mime');
// The Package is past automatically as first parameter
module.exports = function(Player, app, auth, database) {
	app.get('/public/uploads/:playId', function (req,res,next) {
		res.setHeader('Content-Type',mime.lookup(req.originalUrl));
		var range = req.headers.range;
		var positions = range.replace(/bytes=/, '').split('-');
		var start = parseInt(positions[0], 10);
		
		var total = req.params.playId.length;
		var end = total - 1;
		var chunksize = (end-start)+1;
		 
		  res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 
		                        'Accept-Ranges': 'bytes',
		                        'Content-Length': chunksize,
		                        'Content-Type':'video/mp4'});
		  res.end(req.params.playId.slice(start, end+1), 'binary');
			
	});
};
