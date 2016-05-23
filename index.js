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
server.listen(3000, function () {
  console.log('JSON Server is running')
})

// The URI of a game of thrones magnet link
var uri = 'magnet:?xt=urn:btih:a0907157c8a94de5005b1bcc27a2c1d471c344e4&dn=Game.of.Thrones.S06E05.720p.HDTV.x264-AVS%5Brarbg%5D&tr=http://9.rarbg.com:2710/announce&tr=http://announce.torrentsmd.com:6969/announce&tr=http://bt.careland.com.cn:6969/announce&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.tfile.me/announce&tr=http://tracker.torrenty.org:6969/announce&tr=http://tracker.trackerfix.com/announce&tr=http://tracker.trackerfix.com:80/announce&tr=http://www.mvgroup.org:2710/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://9.rarbg.me:2710&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.to:2710&tr=udp://9.rarbg.to:2710/announce&tr=udp://coppersurfer.tk:6969/announce&tr=udp://exodus.desync.com:6969&tr=udp://exodus.desync.com:6969/announce&tr=udp://glotorrents.pw:6969/announce&tr=udp://open.demonii.com:1337&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.glotorrents.com:6969/announce&tr=udp://tracker.internetwarriors.net:1337&tr=udp://tracker.istole.it:6969&tr=udp://tracker.justseed.it:1337&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.leechers-paradise.org:6969/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.publicbt.com:80/announce&tr=udp://tracker4.piratux.com:6969/announce'
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
