# nodejs-jaeger-example
Simple Node.JS service that calls Spotify API in the background and uses Jaeger for tracing. This project is very similar to the Spotify API Demo Java project that I built some time ago (https://github.com/codeforgebelgrade/spotify_api_demo), except it is now implemented in Node.JS and sets up an example for tracing using Jaeger. 

In order to run this project, you have to install all of the dependencies, using `npm install` command. 

Next, you have tu run Docker container that will start Jaeger with the default in-memory storage, exposing only the required ports (of course, you need to have Docker installed on your machine first): 

`docker run --rm -p 6831:6831/udp -p 6832:6832/udp -p 16686:16686 jaegertracing/all-in-one:1.7 --log-level=debug`

You will be able to access Jaeger UI on: http://localhost:16686

Now you can start the demo application. Here's an example request: `localhost:3000/artist-info?artistName=metallica` (you can put any artist/band name you like as a `artistName` parmeter). However, you will also have to set up `Authorization` header for your request - as a value, you will have to provide valid Spotify API access token, that you can obtain on Spotify API website. 

Once you send a few requests, you should be able to see them in Jaeger UI.


