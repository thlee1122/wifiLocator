  //*************************************************************//
  //Google Map Location Search by name of the location

function initAutocomplete() {
  // var fullstack = {lat: 40.705523, lng: -74.009149};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    maxZoom: 20,
    minZoom: 0,
    mapTypeId: 'terrain',
    center: {lat: 40.705523, lng: -74.009149},
    disableDefaultUI: false
  });

  //Create marker
  var marker = createMarker(40.705523, -74.009149, true);

  function createMarker(lat, lng, draggable) {
    return new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      draggable: draggable
    })
  }

  function* idMaker() {
    var index = currentCount++;
    while(true) {
      yield index++;
    }
  }

  var counterReturn = idMaker();

  //Get the counter number from the localStorage.
  var currentCount = Number(localStorage.getItem('counter'));
  currentCount+= 2;


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
  
  var gmarkers = [];
  
  var infowindows = [];

  var counter = 0;

  var currentlyOpenInfo;

  function setMapOnAll() {
    for(var i = 0; i < JSONdata.length; i++) {
      // console.log(JSONdata[i]);
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
      // console.log(information);
      
      gmarkers.push(new google.maps.Marker({
        map: map,
        position: {
          lat: latitude,
          lng: longitude
        },
        icon: 'view/image/wifi.png',
        // icon: iconBase + 'campfire_maps.png'
        index: counter++
      }))

      infowindows.push(new google.maps.InfoWindow({
        content: information
      }));


      gmarkers[gmarkers.length-1].addListener('click', function() {
        if(currentlyOpenInfo) {
          currentlyOpenInfo.close()
        }
        // console.log(infowindows);
        // console.log(infowindows[this.index]);
        infowindows[this.index].open(map, this)
        currentlyOpenInfo = infowindows[this.index];
      })

    }

  }

  //Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
  //Define InfoWindow
  var infowindow = new google.maps.InfoWindow();

  //Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  //Listen for the event fired when the user selects a prediction and retrieve more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    //Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    //Set currentCount
    currentCount = counterReturn.next().value;
    localStorage.setItem('counter', currentCount);
    // console.log('Inside the function', currentCount);

    //For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
      if(!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }

      //Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      }));

      // console.log(place.geometry.location)

      if(place.geometry.viewport) {
        //Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      //Show name of the place when marker is clicked
      var mainMarkerInfo = `<div id="mainMarkerInfo"><strong>${place.name}</strong></div>`
      google.maps.event.addListener(markers[0], 'click', function() {
        infowindow.setContent(mainMarkerInfo);
        infowindow.open(map, this)
      })
    })
    map.fitBounds(bounds);
    var self = this;
    
    //Save search results to the local storage
    // console.log('SearchedLocation', input.value);
    // console.log('Address Counter', currentCount);
    // console.log('Searched Time', +new Date);
    localStorage.setItem(`SearchedLocation${currentCount}`, input.value);
    localStorage.setItem(`Time${currentCount}`, +new Date);
    renderSearch()

    //Set the search bar to empty, so that user can search new locations
    input.value = '';

    setMapOnAll()

  })

  function getItem(index) {
    var searchedAddress = localStorage.getItem(`SearchedLocation${index}`);
    var searchedTime = new Date(parseInt(localStorage.getItem(`Time${index}`)));
    var newSearchedTime = String(searchedTime).slice(0,24) + String(searchedTime).slice(33);

    var parentDiv = document.createElement('DIV');
    
    parentDiv.innerHTML = `<div id="search-result-container"><div><strong>Searched Address:</strong> ${searchedAddress}</div><div><strong>Searched at:</strong> ${newSearchedTime}</div></div>`
    if(searchedAddress === null) {
      parentDiv.innerHTML = '';
    }

    parentDiv.classList.add('result');
    return parentDiv;
  }

  var init = false;
  function renderSearch() {
    var searchResults = document.getElementById('search-history');

    if(!init) {
      retrieveSearch().forEach((e, i) => {
        var item = getItem(i)

        //use insertBefore instead of appendChild
        //appendChild will appendChild at then end of the list and insertBefore will insert child in the very beginning of the list
        searchResults.insertBefore(item, searchResults.childNodes[0]); 
        init = true;
      })
    } else {
      searchResults.insertBefore(getItem(currentCount), searchResults.childNodes[0]);
    }

    console.log(currentCount);
  }

  function retrieveSearch() {
    var retrievedArray = [];

    for(var i = 1; i < currentCount; i++) {
      retrievedArray.push(getItem(i))
    }
    return retrievedArray;

    // for(var i = currentCount; i >= 0; i--) {
    //   retrievedArray.push(getItem(i))
    // }

    // return retrievedArray;
  }

  renderSearch();

  // *************************************************************//
  // NYC Open Data - Art Galleries in NYC

  
  // var clearMarkers = document.getElementById('clear-markers');

  // console.log(clearMarkers);

  // clearMarkers.addListener('click', function(e) {
  //   setMapOnAll(Null);
  // })
  // function clearMarkers() {
  //   setMapOnAll(null);
  // }

  document.getElementById('clear-markers').addEventListener('click', function(e) {
    for(var i = 0; i < gmarkers.length; i++) {
      gmarkers[i].setMap(null);
    }
  })

  document.getElementById('show-markers').addEventListener('click', function(e) {
    setMapOnAll()
  })

  // map.addListener('click', function(e) {
  //   setMapOnAll();
  //   // console.log('Retrieved ' + JSONdata.length + ' records from the dataset');
  //   // var latitude = parseFloat(JSONdata[0].the_geom.coordinates[1]);
  //   // var longitude = parseFloat(JSONdata[0].the_geom.coordinates[0]);
  //   // console.log(typeof(latitude), latitude, longitude);

  //   // var marker = new google.maps.Marker({
  //   //   map: map,
  //   //   position: {
  //   //     lat: latitude,
  //   //     lng: longitude
  //   //   }
  //   // })

  //   // console.log('&**^^*%^$^#$%%@#$#@$@#4', marker)
  //   // console.log(map);
  //   // marker.setMap(map);
  //   // return marker;

  //   // var bounds = new google.maps.LatLngBounds();
  //   // var bounds = new google.maps.LatLngBounds()
  //   // bounds.extend({lat: latitude, lng: longitude})
  //   // console.log(bounds);
  //   // map.fitBounds(bounds)

  //   // console.log(JSONdata[0]);
    

  //     // console.log(markers);
  //     // //Show name of the place when marker is clicked
  //     // console.log(markers);

  //     // for(var j = 0; j < markers.length; j++) {
  //     //   google.maps.event.addListener(markers[j], 'click', function() {

  //     //     infowindow.setContent(name);
  //     //     infowindow.open(map, this)
  //     //   })
  //     // }

  //     // console.log(typeof(markers), markers);

  //     // for(var j = 0; j < markers.length; j++) {
  //     //   var infowindow = new google.maps.InfoWindow({
  //     //     content: 'HELLOOOOO'
  //     //   });

  //     //   markers.addListener('click', function() {
  //     //     infowindow.open(map, markers[j])
  //     //   });
  //     // }
  // })


}

initAutocomplete();




















