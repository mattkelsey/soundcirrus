var SC = require('node-soundcloud');
var fs = require('fs');
var url = require('url');
var http = require('http');
var request = require('request');
var Mpg = require('mpg123');
var path = require('path');
SC.init({
    id: '4121ea32e43d031fbfba8e2a17821bae',
    secret: '04bca05ec426c656dd5eaf92f489b30c',
    uri: 'https://matthewkelsey.com/soundcirrus/callback.html'
});

var initOAuth = function(req, res) {
    var url = SC.getConnectUrl();
    res.writeHead(301, url);
    res.end();
};

var redirectHandler = function(req, res) {
    var code = req.query.code;
    SC.authorize(code, function(err, accessToken) {
        if ( err ) {
            throw err;
        } else {
            // Client is now authorized and able to make API calls 
            console.log('access token:', accessToken);
        }
    });
};

/*downloadSong('136536788', function(filename) {
    playSong(filename);
});
*/
playPlaylist('24967373');
function downloadSong (trackid, callback) {
    SC.get('/tracks/' + trackid, function(err, track) {
        if ( err ) {
            throw err;
        } else {
            var localFile = "temp_" + track.title.substring(0,5) + track.id + ".mp3";
            var file = fs.createWriteStream(localFile);
            var remoteFile = "https://api.soundcloud.com/tracks/"+ trackid +"/stream?client_id=fe2f6074657651c9128168cfbbf7ee4f"
            request.head(remoteFile, function(err, res, body) {
    		        if (!err && res.statusCode == 200) {
				            var r = request(remoteFile).pipe(file);
                    r.on('close', function() {
                       callback(r.path);
                    });
                } else {
		                throw err;
			          }
		        });

        }
    });
}

//191058000

function playPlaylist (playlistid, callback) {
    SC.get('/playlists/' + playlistid, function(err, playlist) {
        if ( err ) {
            throw err;
        } else {
            for (i in playlist.tracks) {
                console.log(playlist.tracks[i].id);
            }
            //console.log(playlist);
        }
    });
}

function playSong (filename) {
    var player = new Mpg();
    player.play(path.join(__dirname, filename));
}
