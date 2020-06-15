const express = require("express");
const app = express();
const https = require('https');
const initJaegerTracer = require("jaeger-client").initTracer;
const opentracing = require("opentracing");
const tracer = initTracer("simple-api-request");

function initTracer(serviceName) {
    const config = {
      serviceName: serviceName,
      sampler: {
        type: "const",
        param: 1,
      },
      reporter: {
        logSpans: true,
      },
    };
    const options = {
      logger: {
        info(msg) {
          console.log("INFO ", msg);
        },
        error(msg) {
          console.log("ERROR", msg);
        },
      },
    };
    return initJaegerTracer(config, options);
}

 function handleSpotifyRequest(artistName, accessToken, rootSpan){
    return new Promise((resolve, reject) => {
        const span = tracer.startSpan("call-spotify-API", { childOf: rootSpan });
        let options = {
            headers: {'Authorization': accessToken}
        }
        let url = 'https://api.spotify.com/v1/search?q=' + artistName +"&type=artist";
        span.log({
            event: "spotify-search-artist",
            value: artistName,
            host: url,
            headers: options
          });
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
        span.finish();
    });
}

app.get("/artist-info", (req, res) => {
    const rootSpan = tracer.startSpan("get-artist-info");
    let accessToken = req.header("Authorization");
    let artist = req.query.artistName;
    rootSpan.log({
        event: "artist-info request",
        search_string: artist,
        endpoint: "/artist-info",
        headers: req.headers
      });
    handleSpotifyRequest(artist, accessToken, rootSpan).then(response => {
        res.send(response)
    })
    .catch(error => {
        res.send(error)
    })
    rootSpan.finish();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

