var DHT = require('bittorrent-dht')
var magnet = require('magnet-uri')
var geoip = require('geoip-lite');
var jsonfile = require('jsonfile')
var kat = require("kat-api-json");

var torrents = {}

function getTorrentIndex(hash) {
  for (var i=0; i < torrents.length; i++){
    if (Buffer.compare(Buffer(torrents[i]["hash"], 'hex'),hash)){
      return i
    }
  }
}

// server.js
var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router(torrents)
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(process.env.PORT, function () {
  console.log('JSON Server is running')
})

var dht = new DHT()

dht.listen(20000, function () {
  console.log('now listening')

  kat.mostPopular({
    category: "tv",
    page: 1
  },function(err,data){
    if ( err ) {
      throw err;
    }
    for (var i = 0; i < data["list"].length; i++){
      var torrent = data["list"][i]

      if (torrent["category"] != "XXX"){
        torrent["IPs"] = []
        dht.lookup(torrent["hash"])
        console.log(torrent["seeds"])

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
})


dht.on('peer', function (peer, infoHash, from) {
  var location = geoip.lookup(peer.host)

  if(location){

    delete location["range"]
    var entry = {"ip": peer.host,
    "location": location}
    torrents[infoHash.toString('hex')]["IPs"].push(entry)
  }
})
