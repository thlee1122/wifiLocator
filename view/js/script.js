// //Global variable for saving all the search histories
// var searchHistory = [];

// //Initiate Map on the webpage
// function initMap() {
//   // var fullstack = {lat: 40.705523, lng: -74.009149};
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 18,
//     maxZoom: 19,
//     minZoom: 16 ,
//     center: {lat: 40.705523, lng: -74.009149},
//     disableDefaultUI: false
//   });

//   //Create marker
//   var marker = createMarker(40.705523, -74.009149, true);

//   function createMarker(lat, lng, draggable) {
//     return new google.maps.Marker({
//       position: {
//         lat: lat,
//         lng: lng
//       },
//       map: map,
//       draggable: draggable
//     })
//   }

//   //geocoder
//   var geocoder = new google.maps.Geocoder();

//   //Get the counter number from the localStorage
//   var currentCount = Number(localStorage.getItem('counter'));
//   currentCount+= 2;
  
//   //Place marker on the inputted adress (latitue, longitue)
//   document.getElementById('address-btn').addEventListener('click', function() {
//     console.log('Inside event listener', currentCount);
//     geocodeAddress(geocoder, map);
//     currentCount = counterReturn.next().value;
//     localStorage.setItem('counter', currentCount);
//   });

//   //Generator function for making id by increasing the counter value
//   function* idMaker() {
//     var index = currentCount++;
//     while(true) {
//       yield index++;
//     }
//   }

//   var counterReturn = idMaker();

//   function geocodeAddress(geocoder, resultsMap) {
    
//     //Get address from search bar
//     var address = document.getElementById('search-location').value;
    
//     //Push it to the searchHistory array
//     // searchHistory.push(address);
//     // console.log(searchHistory);

//     //Fetch latitude and longitude of the inputted address in the search bar
//     geocoder.geocode({ 'address': address }, function(results, status) {
//       if(status === 'OK') {
//         console.log(results);
//         resultsMap.setCenter(results[0].geometry.location);

//         //Place marker on the fetched latitude and longitude
//         var marker = new google.maps.Marker({
//           map: resultsMap,
//           position: results[0].geometry.location
//         }); 
//       } else {
//         //Output error code if it fails with the status code
//         alert('Geocode was not successful for the following reason: ' + status);
//       }
      
//       console.log('geocode Address', currentCount);

//       //Save searched address to the local storage
//       //Need to fix it so that it adds the all searched address into the local storage
//       localStorage.setItem(`searchedLocation${currentCount}`, address);

//       //Save created data and time
//       localStorage.setItem(`time${currentCount}`, +new Date);

//       // var event = new Event('reload');
//       // document.dispatchEvent(event);
//       renderSearch();
//     })

//     //Set the search bar to empty, so that user can type in new address
//     document.getElementById('search-location').value = '';
//   }

//   //function to getItem from localStorage
//   //http://stackoverflow.com/questions/20538199/store-date-and-retrieve-from-local-storage
//   function getItem(index) {
//     var searchedAddress = localStorage.getItem(`searchedLocation${index}`);
//     var searchedTime = new Date(parseInt(localStorage.getItem(`time${index}`)));
    

    
//     console.log(`searchedLocation${index}:`, searchedAddress);
//     console.log(`time${index}:`, searchedTime);
//     var parentDiv = document.createElement('DIV');
    
//     parentDiv.innerHTML = `<div>Searched Address: ${searchedAddress}</div><div>Searched at: ${searchedTime}</div>`
//     if(searchedAddress === null) {
//       parentDiv.innerHTML = '';
//     }

//     parentDiv.classList.add('result');
//     return parentDiv;
//   }

//   //Render search address and time that are saved in local storage to search history section
//   //How to make it so that the information in the search-history-container changes right away without refreshing the page
//   var init = false;
//   function renderSearch() {
    
//     var searchResults = document.getElementById('search-history');

//     //Clear Search Results 
//     // searchResults.innerHTML = '';

//     if(!init) {
//       retrieveSearch().forEach((e, i) => {
//         var item = getItem(i)

//         searchResults.appendChild(item);
//         init = true;
//       })
//     } else {
//       searchResults.appendChild(getItem(currentCount));
//     }
//   }

//   function retrieveSearch() {
//     var retrievedArray = [];

//     for(var i = 1; i < currentCount; i++) {
//       retrievedArray.push(getItem(i))
//     }

//     return retrievedArray;
//   }

//   // document.addEventListener('reload', function() {
//   //   console.log('I am reload');
//   //   renderSearch();
//   // })

//   renderSearch();

//   //Event handler for marker to infoWindow when it is clicked
//   google.maps.event.addListener(marker, 'click', function(e) {
//     var infoWindow = new google.maps.InfoWindow({
//       content: 'Location'
//     });

//     infoWindow.open(map, marker);
//   })

//   // //Event handler to get the latitude and longitude when the map is clicked
//   // google.maps.event.addListener(map, 'click', function(e) {
//   //   alert('clicked');
//   //   console.log(e);
//   // });
// }





// //*************************************************************//
// //Instagram API Functions

// // window.Instagram = {
// //   //Store application settings
// //   config: {},
// //   BASE_URL: 'https://api.instagram.com/v1',

// //   init: function(opt) {
// //     opt = opt || {};
// //     this.config.access_token = opt.access_token
// //   },

// //   //Get a list of popular instagram photos
// //   popular: function(callback) {
// //     var endpoint = this.BASE_URL + '/media/popular?access_token=' + this.config.access_token;
// //     this.getJSON( endpoint, callback )
// //   },

// //   //Get a lis ot recently tagged instagram photos by tag name
// //   tagByName: function() {
// //     var endpoint = this.BASE_URL + '/tags/' + name + '/media/recent?access_token=' + this.config.access_token;
// //     this.getJSON( endpoint, callback );
// //   },

// //   getJSON: function(url, callback) {
// //     $.ajax({
// //       type: 'GET',
// //       url: url,
// //       dataType: 'jsonp',
// //       success: function( response ) {
// //         if(typeof callback === 'function' ) callback( response ); 
// //       }
// //     })
// //   }
// // };

// // Instagram.init({
// //   access_token: '2213954697.dc4bc5f.20ac84b02e1e4596976803742f1f74b6'
// //   // client_id: 'dc4bc5f65bdb4a86a54433da543fcada'
// // });

// // Instagram.popular(function(response) {
// //   console.log("RESPONSE", response)
// //   var instagramPhoto = document.getElementById('instagram');
// //   for(var i = 0; i < response.data.length; i++) {
// //     imageUrl = response.data[i].images.low_resolution.url;
// //     instagramPhoto.append(`<img src=${imageUrl}/>`);
// //   }
// // })

// // //Event handler to get the popular instagram photos when the map is clicked
// // google.maps.event.addListener(map, 'click', function(e) {
// //   console.log('clicked');
// //   Instagram.popular();
// // });

// initMap();










