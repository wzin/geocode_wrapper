function geoSearch(search_terms, google_client_id, google_client_signature )
{
  /** ordinary query example
  * http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
  *
  * reverse query example
  * http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=false
  *
  * NOTE: Maps API for Business users must include valid client and signature parameters with their Geocoding requests. Please refer to Maps API for Business Web Services for more information
  *
  * `search_terms`, mandatory - should be equal to query that you put into google maps.
  * `google_client_id` - optional (depends on whether client has business account)
  * `google_client_signature` - optional (depends on whether client has business account)
  *
  * USAGE:
  *  1. instantiate : a = new geoSearch("920 Broadway Suite 701, New York, NY");
  *  2. search : a.search();
  *  3. retrieve array of maps : a.result;
  *
  * USAGE v2:
  *  1. instantiate : a = new geoSearch("920 Broadway Suite 701, New York, NY");
  *  2. search : a.search(function(data, $scope){...});
  *
  * result format is map Object : {formatted_address: "920 Broadway #701, New York, NY 10036, USA", lat: 40.7395284, lng: -73.9895417}
  **/

  var status;
  var results = [];
  this.results = results;
  var data = [];
  this.data = data;

  if (google_client_id && google_client_signature) {
    //we're doin business!
    var url_data = {'address': search_terms, 'sensor' : 'false', 'client': google_client_id, 'signature': google_client_signature};
  } else {
    var url_data = {'address': search_terms, 'sensor' : 'false'};
  }

  function encode_query_data(data)
  {
     var ret = [];
     for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
     return ret.join("&");
  }

  var url = "http://maps.googleapis.com/maps/api/geocode/json?"  + encode_query_data(url_data);

  var that = this;

  this.search = function(callback)
  {
    var xmlhttp;
    var result;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        that.data = JSON.parse(xmlhttp.responseText);
        geodata = that.data.results;
        if (geodata.length > 0) {
          console.log("geodata: " + geodata + " length : " + geodata.length);
          var local_result = []
          for (var i = 0; i < geodata.length; i++) {
            local_result.push({});
            local_result[i].formatted_address = (geodata[i].formatted_address);
            local_result[i].lat = (geodata[i].geometry.location.lat);
            local_result[i].lng = (geodata[i].geometry.location.lng);
          }
          that.result = local_result;
          callback(local_result);
          }
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
}

