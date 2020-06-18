const https = require('https');
const { tracer } = require("./tracer-def");

module.exports = {
    handleSpotifyRequest: (artistName, accessToken, rootSpan) => {
        return new Promise((resolve, reject) => {
            const span = tracer.startSpan("call-spotify-API", { childOf: rootSpan });
            let options = {
                headers: {"Authorization": accessToken}
            }
            let url = "https://api.spotify.com/v1/search?q=" + artistName +"&type=artist";
            span.log({
                event: "spotify-search-artist",
                value: artistName,
                host: url,
                headers: options
            });
            https.get(url, options, (resp) => {
                let data = "";

                // A chunk of data has been recieved.
                resp.on("data", (chunk) => {
                data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on("end", () => {
                let output = data;
                resolve(output);
                });
            }).on("error", (err) => {
                reject("Error: " + err.message);
            });
            span.finish();
        });
    }
}
