var SC = require('node-soundcloud');
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

SC.get('/playlists/24967373', function(err, playlist) {
    if ( err ) {
        throw err;
    } else {
        console.log('track retrieved:', playlist);
    }
});
