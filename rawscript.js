//*********************************************
  var JSONdata;

  window.wifiLocation = {
    getJSON: function() {
      return $.ajax({
        url: "https://data.cityofnewyork.us/resource/jd4g-ks2z.json",
          type: "GET",
          data: {
            "$limit" : 5000,
            "$$app_token" : "BxODxYQM7iagMGICT0QVjRIHv"
          }
      }) 
    }
  }

  wifiLocation.getJSON().then(results => JSONdata = results);
  // wifiLocation.getLocation();

  function setMapOnAll() {
    for(var i = 0; i < JSONdata.length; i++) {
      console.log(JSONdata[i]);
      var latitude = parseFloat(JSONdata[i].lat);
      var longitude = parseFloat(JSONdata[i].lon);
      var ssid = JSONdata[i].ssid;
      var location = JSONdata[i].location;
      var name = JSONdata[i].name;
      var city = JSONdata[i].city;
      // console.log(typeof(latitude), latitude, longitude, ssid);
      var information = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            `<h4>${ssid}</h4>`+
            '<div id="bodyContent">'+
            `<p><strong>Location:</strong> ${location} ${city} ,NY</p>` +
            `<p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>` +
            '</div>'+
            '</div>';

      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: latitude,
          lng: longitude
        },
        icon: iconBase + 'campfire_maps.png'
      })

      var infowindow = new google.maps.InfoWindow({
        content: information
      });

      marker.addListener('click', function() {
        console.log(this);
        infowindow.open(map, this)
      }.bind(marker));
    }
  }