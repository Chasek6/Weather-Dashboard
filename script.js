// Main Variables section & query selector function--click function---if statement---push city to local storage & eventlistener -- prevent function from recurring same results every click.

var city = 'New York'
var APIkey ='44f16f0f5b78c42ed94c3a20683882d4';
var currentDate = moment().format('dddd, MMMM Do YYYY');
var searchHistory = [];
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {return;}
	searchHistory.push(city);
	localStorage.setItem('city', JSON.stringify(searchHistory));
	weatherForecastEl.empty();
	getForecastToday();
	getSearchHistory();
});
var weatherForecastEl = $('.weatherForecast');

// API Which Pulls for weather in five day forecast
function getweatherForecast() {
	var getweatherForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIkey}`;

	$.ajax({
		url: getweatherForecastURL,
		method: 'GET',
	}).then(function (response) {
		var weekArray = response.list;
		var myWeather = [];
		$.each(weekArray, function (index, value) {
			testObj = {
				currentDate: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "15:00:00") {
				myWeather.push(testObj);
			}
		}) 
		for (let i = 0; i < myWeather.length; i++) {

            
			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			weatherForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'cardHeader')
			var m = moment(`${myWeather[i].currentDate}`).format('MM/DD/YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)
		

            var divElBody = $('<div>');
			divElBody.attr('class', 'cardBody');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'weatherIcons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			var pElTemperature = $('<p>').text(`Temperature: ${myWeather[i].temp} ??F`);
			divElBody.append(pElTemperature);
			//Feels Like
			var pElFeelsLike = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} ??F`);
			divElBody.append(pElFeelsLike);
			//Humidity
			var pElHumidity = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumidity);

		}
	});
}
var weatherDetails = $('.weatherDetails')





// five day forecast


function getForecastToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;

	$(weatherDetails).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.weatherCity').text(response.name);
		$('.weatherDate').text(currentDate);


		// location for the searched city

        
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;
		$('.weatherIcons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

		//current temperature for city
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} ??F`);
		weatherDetails.append(pEl);

		
		var pElFeelsLike = $('<p>').text(`Feels Like: ${response.main.feels_like} ??F`);
		weatherDetails.append(pElFeelsLike);


		
		var pElHumidity = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		weatherDetails.append(pElHumidity);

		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		weatherDetails.append(pElWind);

		var getUrlSunny = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${APIkey}`;

		$.ajax({
			url: getUrlSunny,
			method: 'GET',
		}).then(function (response) {
			var pElUvi = $('<p>').text(`UV Index: `);
			var uviSpan = $('<span>').text(response.current.uvi);
			var uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			weatherDetails.append(pElUvi);
			if (uvi >= 0 && uvi <= 2) {
				uviSpan.attr('class', 'favorable');
			} else if (uvi > 2 && uvi <= 5) {
				uviSpan.attr("class", "moderate")
			} else if (uvi > 5 && uvi <= 7) {
				uviSpan.attr("class", "severe")
			} else {
				uviSpan.attr("class", "undefinedUVI")
			}
		});
	});
	getweatherForecast();
}


//Example content fot user experience and look of site
function sampleCity() {

	var searchHistoryStore = JSON.parse(localStorage.getItem('city'));

	if (searchHistoryStore !== null) {
		searchHistory = searchHistoryStore
	}
	getSearchHistory();
	getForecastToday();
}
// Call function above to display sample city on load) sample city function 
sampleCity();

// Search History-clickable elements 


function getSearchHistory() {
	var searchHistoryClickify = $('.searchHistory');
	searchHistoryClickify.empty();
	for (let i = 0; i < searchHistory.length; i++) {
		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${searchHistory[i]}`)
		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary btn-block histBtn');
		btnEl.attr('type', 'button');
		searchHistoryClickify.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		weatherForecastEl.empty();
		getForecastToday();
	});
}