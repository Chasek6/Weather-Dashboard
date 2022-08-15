//Assigned Variable Section 



var searchHistoryE1 = $('#searchHistory');
var searchResultsE1 = $('#searchResults');
var searchButton = $('#searchButton');
var Apikey = "44f16f0f5b78c42ed94c3a20683882d4"
function fetchcity (cityname) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q="+ cityname+ "&appid=" + Apikey)
}
searchButton.click(function(){
   var user_input = $('#search-input').val();
    console.log(user_input) 
    fetchcity(user_input)
  });



//   http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

