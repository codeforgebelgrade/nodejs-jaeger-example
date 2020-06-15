const https = require('https');

module.exports = {
    
    make_API_call : function(artistName, accessToken){
        return new Promise((resolve, reject) => {
            let options = {
                headers: {'Authorization': accessToken}
            }
            let url = 'https://api.spotify.com/v1/search?q=' + artistName +"&type=artist";
            https.get(url, options, (resp) => {

                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                let output = data;
                resolve(output);
                });

            }).on("error", (err) => {
                reject("Error: " + err.message);
            });
        });
    }
}