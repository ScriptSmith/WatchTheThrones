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
var torrents

function initMap() {

  function checkDB(){
    $.getJSON("http://localhost:3000/db", function( data ) {
      console.log("Checked db")

      var newMarkers = [];
      torrents = data

      for(var torrent in torrents){
        for (var j=0; j < torrents[torrent]["IPs"].length; j++){
          var downloader = torrents[torrent]["IPs"][j]

          if (markers.indexOf(downloader) == -1){
            markers.push(downloader);
            newMarkers.push(downloader);
          }
        }
      }
      drop(newMarkers);
    });
  }


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
    console.log(downloaders.length)
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
      something = window.open("data:text/json," + encodeURIComponent(markers),
                       "_blank");
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
    controlText.innerHTML = 'People downloading: 0';
    controlText.setAttribute("id", "mainTitle");
    controlUI.appendChild(controlText);

  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 30, lng: 15.35}
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
       console.log("dropping")
     }
   }

   function addMarkerWithTimeout(pin, timeout) {

     window.setTimeout(function() {
       var marker = new google.maps.Marker({
         position: {lat: pin['location']['ll'][0], lng: pin['location']['ll'][1]},
         map: map,
         title: pin['ip'],
         icon: "marker.png",
        //  animation: google.maps.Animation.DROP
       });

      marker.addListener('click', function() {
        console.log(pin['ip'])
        infowindow.open(map, marker);

        downloaders = getDownloadersAt(pin["location"])

        var text = ""
        for (var i = 0; i < downloaders.length; i++){
          var text = text + getTorrentInfo(pin)
        }
        $("#infoText").html(text)
      });

       $("#mainTitle").html("People I found downloading:<br>" + count)
       count+=1
     }, 0);
   }
   setInterval(checkDB(), 60000);
}
