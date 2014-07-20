'use strict';

// The Package is past automatically as first parameter
module.exports = function(Player, app, auth, database) {

    app.get('/player/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/player/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/player/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/player/example/render', function(req, res, next) {
        Player.render('index', {
            package: 'player'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
