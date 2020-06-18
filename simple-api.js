const express = require("express");
const { tracer } = require("./tracer-def");

const app = express();

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
