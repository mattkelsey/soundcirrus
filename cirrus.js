//A nice SoundCloud API wrapper to save some time
var SC = require('node-soundcloud');

//Standard includes for various functionallity
var fs = require('fs');
var url = require('url');
var http = require('http');
var request = require('request');
var path = require('path');
var nconf = require('nconf');

//Mpg123 for playing audio
var Mpg = require('mpg123');

//Readline for taking user input
const readline = require('readline');

//SoundCirrus client_id so I don't have to type it
var client_id = '4121ea32e43d031fbfba8e2a17821bae';

//Initialize configuration file with nconf
nconf.argv()
    .file({ file: 'config.json' });

console.log(nconf.get('p'));

//Initialize with SoundCloud confirming client ID and secret...
//Insures that it is the SoundCirrus application requesting data. Validates against file hosted on server.
SC.init({
    id: client_id,
    secret: '04bca05ec426c656dd5eaf92f489b30c',
    uri: 'https://matthewkelsey.com/soundcirrus/callback.html'
});

//Initialize OAuth2 and validate with the callback page on server
var initOAuth = function(req, res) {
    var url = SC.getConnectUrl();
    res.writeHead(301, url);
    res.end();
};

//Follow redirects through authorization
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

//Determine what to do based on arguments
getPlaylist(nconf, function(tracks) {
    //If user specified reverse flag, start with last track
    if(nconf.get('r')) {
        playPlaylist(tracks, tracks.length-1);
    } else {
        playPlaylist(tracks, 0);
    }
});


function playPlaylist(trackArray, index, callback) {
    console.log("downloading.......");
    //From the trackArray in the retrieved playlist download and play the first song
    downloadSong(trackArray[index], function(song) {
        console.log("downloaded: " + trackArray[index]);
        console.log("playing")
        playSong(song, function () {
            console.log("played");
            //When the song has finished repeat the process with the next song in the trackArray
            if(nconf.get('r')) {
                playPlaylist(trackArray, index-1);
            } else {
                playPlaylist(trackArray, index+1);
            }
        });
    });
}

function downloadSong (trackid, callback) {
    //Get data for given trackID
    SC.get('/tracks/' + trackid, function(err, track) {
        if ( err ) {
            throw err;
        } else {
            //Create a unique localFile for the track to be downloaded into
            var localFile = "temp_" + track.title.substring(0,5) + track.id + ".mp3";
            //Create a writeStream to this file
            var file = fs.createWriteStream(localFile);

            //Retrieve track
            var remoteFile = "https://api.soundcloud.com/tracks/"+ trackid +"/stream?client_id=" + client_id;
            request.head(remoteFile, function(err, res, body) {
    		        if (!err && res.statusCode == 200) {
                    //Pipe data from remote file to the writeStream of the localFile
                    //future versions will offer the option to pipe to localFile or stream directly
                    //with websockets
                    var r = request(remoteFile).pipe(file);
                    r.on('finish', function() {
                        //When finished, callback
                        callback(r.path);
                    });
                } else {
		                throw err;
			          }
		        });

        }
    });
}

function getPlaylist (nconf, callback) {
    var playlistid;
    //check if playlist was specified
    if(nconf.get('p') != undefined) {
        //play playlist by configured name
        playlistid = nconf.get("playlists:" + nconf.get('p'));
    } else if (nconf.get('P') != undefined) {
        //play playlist by id
        playlistid = nconf.get('P');
    }

    //Check if playlist should be played in reverse

    //Get data for given playlistID
    SC.get('/playlists/' + playlistid, function(err, playlist) {
        if ( err ) {
            throw err;
        } else {
            //Make an array of trackID of the songs in the playlist
            var trackArray = [];
            for (i in playlist.tracks) {
                trackArray[i] = playlist.tracks[i].id;
                //playlist.tracks[i].id
            }
            callback(trackArray);
        }
    });
}

function playSong (filename, callback) {
    //This variable will be used later to ensure that the callback is not executed twice
    var skipped = false;

    //Create a new instance of Mpg() and begin playing the given filePath
    var player = new Mpg();
    player.play(path.join(__dirname, filename));

    //create readLine for user input from stdin
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (cmd) => {
        //console.log(`${cmd}`);
        if(`${cmd}` == "next") {
            //Stop playing the song (otherwise it will continue playing back even after the callback has been called)
            //This method ends the song which will trigger the .on('end') listener, in turn firing the callback and closing the readLine
            player.stop();
        } else if (`${cmd}` == "pause") {
            player.pause();
        } else if (`${cmd}` == "resume") {
            player.play(path.join(__dirname, filename));
        }
    });

    //This will execute when the track ends, whether it be by the user (typing in next), or from the song being over
    player.on('end', function(data) {
        //Close readLine
        rl.close();
        //Clean file system and callback
        fs.unlink(path.join(__dirname, filename));
        callback();
    });

    //If user terminates application, clean filesystem
    process.on('SIGINT', function() {
        console.log("Cleaning up...")
        fs.unlink(path.join(__dirname, filename));
        console.log("Exiting");
    })

}
