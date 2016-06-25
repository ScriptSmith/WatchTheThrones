var DHT = require('bittorrent-dht')
var magnet = require('magnet-uri')
var geoip = require('geoip-lite');
<<<<<<< HEAD

var locations = []

// server.js
var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router(locations)
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(process.env.PORT, function () {
  console.log('JSON Server is running')
})

// The URI of a game of thrones magnet link
var uri = 'magnet:?xt=urn:btih:456569B4B26B72F59DA2260931D3F3E8A128EB49&dn=game+of+thrones+s06e06+720p+hdtv+x264+avs+rartv&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce'
var parsed = magnet(uri)

console.log(parsed.infoHash)

var dht = new DHT()

dht.listen(20000, function () {
  console.log('now listening')
})

dht.lookup(parsed.infoHash)
setInterval(function() {
  console.log('Hi')
  // find peers for the given torrent info hash
  dht.lookup(parsed.infoHash)
}, 60000)

dht.on('peer', function (peer, infoHash, from) {
  // console.log('found potential peer ' + peer.host + ':' + peer.port + ' through ' + from.host + ':' + from.port)
  var location = geoip.lookup(peer.host)
  // console.log(location)
  if(location){
    // console.log('Found ' + peer.host + " at " + location['city'] + ', ' + location['country'])
    // console.log(location['ll'])

    locations.push({"ip": peer.host,
    "ll": location["ll"]});
  }
})
=======
// var jsonfile = require('jsonfile')
var http = require("https");
var express = require('express');
var app = express();

var torrents = {}

// Server
// var jsonServer = require('json-server')
// var server = jsonServer.create()
// var router = jsonServer.router("hello")
// var middlewares = jsonServer.defaults()
//
// server.use(middlewares)
// server.use(router)
// server.listen(3000, function () {
//     console.log('JSON Server is running')
// })

// Init DHT
var dht = new DHT()

function getKAT(){
    console.log("Searching KAT")
    var url = 'https://kat.cr/json.php?q=game+of+thrones';

    http.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          torrents = {}
          var data = JSON.parse(body);

          for (var i = 0; i < data["list"].length; i++){
            var torrent = data["list"][i]

            if (torrent["category"] != "XXX"){
              torrent["IPs"] = []
              dht.lookup(torrent["hash"])

              delete torrent["link"]
              delete torrent["guid"]
              delete torrent["torrentLink"]
              delete torrent["files"]
              delete torrent["comments"]
              delete torrent["votes"]
              delete torrent["verified"]

              torrent["Upload Date"] = torrent["pubDate"];
              delete torrent["pubDate"];

              torrents[torrent["hash"].toLowerCase()] = torrent
            }
          }
      });
    }).on('error', function(e){
        console.log("Got an error: ", e);
    });
}

dht.listen(20000, function () {
    console.log('now listening')
    getKAT()
    setInterval(function(){getKAT()}, 120000)
})

dht.on('peer', function (peer, infoHash, from) {
    var location = geoip.lookup(peer.host)

    if(location){
        delete location["range"]
        var entry = {"ip": peer.host,
        "location": location}
        if (infoHash.toString('hex') in torrents){
            torrents[infoHash.toString('hex')]["IPs"].push(entry)
        }
    }
})

app.get('/db', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', "*")
    console.log('Recieved request')
    res.json(torrents);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
>>>>>>> kickass
