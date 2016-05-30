var DHT = require('bittorrent-dht')
var magnet = require('magnet-uri')
var geoip = require('geoip-lite');

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
