var styles =
[
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#333739"
            },
            {
                "weight": 0.8
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2ecc71"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "color": "#2ecc71"
            },
            {
                "lightness": -7
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "color": "#2ecc71"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#333739"
            },
            {
                "weight": 0.3
            },
            {
                "lightness": 10
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2ecc71"
            },
            {
                "lightness": -28
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2ecc71"
            },
            {
                "visibility": "on"
            },
            {
                "lightness": -15
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2ecc71"
            },
            {
                "lightness": -18
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2ecc71"
            },
            {
                "lightness": -34
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#333739"
            }
        ]
    }
]
var count = 0
var markers = []
var mapsmarkers = []
var heatmarkers = []
var visTog = false
var torrents

var map
var heatmap

function initMap() {

  function checkDB(){
    $.getJSON("https://watch-the-thrones.herokuapp.com/db", function( data ) {
      console.log("Checked db")

      var newMarkers = [];
      torrents = data

      for(var torrent in torrents){
        for (var j=0; j < torrents[torrent]["IPs"].length; j++){
          var downloader = torrents[torrent]["IPs"][j]
          markers.push(downloader);
          newMarkers.push(downloader);

          if (markers.indexOf(downloader) == -1){
            heatmarker = new google.maps.LatLng(downloader["location"]["ll"][0],downloader["location"]["ll"][1]);
            heatmarkers.push(heatmarker);
          }
        }
      }
      drop(newMarkers);
    });
  }

  checkDB()

  function capital(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getDownloadersAt(location){
    var downloaders = []
    for(var torrent in torrents){
      for(var i = 0; i < torrents[torrent]["IPs"].length; i++){
        if (torrents[torrent]["IPs"][i]["location"] == location){
          downloaders.push(torrents[torrent]["IPs"][i])
        }
      }
    }
    return downloaders
  }

  function getTorrentInfo(ip){
    for(var torrent in torrents){
      if (torrents[torrent]["IPs"].indexOf(ip) != -1) {
        var torrent = torrents[torrent]
        var text = "<b>IP: </b>" + ip["ip"]

        for (attribute in torrent){
          if (attribute != "IPs"){
            text = text + "<br><b>" + capital(attribute) + ": </b>" + torrent[attribute]
          }
        }
        return text
      }
    }
    return "nothing"
  }

  function CenterControl(controlDiv, map) {

    controlDiv.onclick = function() {
      something = window.open("https://watch-the-thrones.herokuapp.com/db");
       something.focus();
    }

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'People downloading';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'People downloading Game of Thrones right now:<br>0';
    controlText.setAttribute("id", "mainTitle");
    controlUI.appendChild(controlText);

  }

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 30, lng: 15.35}
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmarkers,
  });

  map.setOptions({styles: styles});

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  var infowindow = new google.maps.InfoWindow({
   content: "<div id='infoText'></div>"
 });

  function drop(data) {
     for (var i = 0; i < data.length; i++) {
       addMarkerWithTimeout(data[i], i * Math.random()*3 * 100);
     }
   }

   function addMarkerWithTimeout(pin, timeout) {

     window.setTimeout(function() {
       var marker = new google.maps.Marker({
         position: {lat: pin['location']['ll'][0], lng: pin['location']['ll'][1]},
         map: map,
         title: pin['ip'],
         icon: "marker.png",
         visible: !visTog
        //  animation: google.maps.Animation.DROP
       });

      marker.addListener('click', function() {
        infowindow.open(map, marker);

        downloaders = getDownloadersAt(pin["location"])

        var text = ""
        for (var i = 0; i < downloaders.length; i++){
          var text = text + getTorrentInfo(pin)
        }
        $("#infoText").html(text)
      });

      mapsmarkers.push(marker)

      $("#mainTitle").html("People downloading Game of Thrones right now:<br>" + count)
      count+=1
     }, timeout);
   }
}

function toggleVisualisation(){
    for(var i = 0; i < mapsmarkers.length; i++){
        mapsmarkers[i].setVisible(visTog);
    }

    if (visTog == false){
        heatmap.setMap(map);
    } else {
        heatmap.setMap(null);
    }


    visTog = !visTog;
}

function lewisb(){
    console.log(markers.length)
}
