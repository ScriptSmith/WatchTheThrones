var DHT = require('bittorrent-dht')
var magnet = require('magnet-uri')
var geoip = require('geoip-lite');
var jsonfile = require('jsonfile')

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
var uri = 'magnet:?xt=urn:btih:3d400e3031918a28c6372928eea39fcb15113001&dn=Game+of+Thrones+Season+6+S06+Complete+1080p+WEB+DL+x265+HEVC+SUJ&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'
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
