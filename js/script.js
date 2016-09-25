$(document).ready(function() {
  var weatherDisplayTemplate = Handlebars.compile($("#weather-display-script").html());
  var forecastDisplayTemplate = Handlebars.compile($("#forecast-display-script").html());

  Handlebars.registerPartial("weather-partial", $("#weather-display-partial").html());
  var weatherPartialTemplate = Handlebars.compile($("#weather-display-partial").html());

  Handlebars.registerPartial("forecast-partial", $("#forecast-display-partial").html());
  var forecastPartialTemplate = Handlebars.compile($("#forecast-display-partial").html());


  Handlebars.registerHelper('imgLink', function(iconID) {
    return new Handlebars.SafeString(
      "<img src='http://openweathermap.org/img/w/" + iconID + ".png' class='img-responsive'>"
    );
  });

  $("#search-button").click(function() {
    displayCurrentWeather();
  });

  $("#searchbar-input").on("keypress", function(e) {
    if (e.which === 13) {
      $(this).attr("disabled", "disabled");
      displayCurrentWeather();
      $(this).removeAttr("disabled");
    }
  })

  /*
  * Show the 24 hour forecast.
  * Have to use on() rather than click() because element doesn't exist until after DOM loaded
  */
  $("#weather-display").on("click", "#forecast-button", function() {
    displayForecast();
  });

  /*
  * Show the current weather.
  * Have to use on() rather than click() because element doesn't exist until after DOM loaded
  */
  $("#forecast-display").on("click", "#weather-button", function() {
    displayCurrentWeather();
  });

  function displayForecast() {
    $("#weather-display").fadeOut();
    $.get("http://api.openweathermap.org/data/2.5/forecast?q=" + $("#searchbar-input").val() + "&units=metric&appid=f1bd4a0fa665e173cfc001f3bdd1d429", function(data, status){
      if (data.cod == 200) {
        data.list.splice(8); // too much data, remove forecasts except for first 8 (represents 24 hours)

        for (var i = 0; i < data.list.length; i++) {
          data.list[i]["dt_txt"] = convertUnixToDate(data.list[i].dt);
          console.log(data.list[i].dt_txt);
        }

        var date = convertUnixToDate(data.dt);
        data["date"] = date;
        $("#forecast-display").html(forecastDisplayTemplate(data));
        $("#forecast-display-partial").html(forecastPartialTemplate(data));
      }
    });
    $("#forecast-display").fadeIn();
  }

  function displayCurrentWeather() {
    $("#forecast-display").fadeOut();
    $.get("http://api.openweathermap.org/data/2.5/weather?q=" + $("#searchbar-input").val() + "&units=metric&appid=f1bd4a0fa665e173cfc001f3bdd1d429", function(data, status){
      if (data.cod == 200) {
        console.log(data);

        data["dt"] = convertUnixToDate(data.dt);
        $("#weather-display").html(weatherDisplayTemplate(data));
        $("#weather-display-partial").html(weatherPartialTemplate(data));
      }
    });
    $("#weather-display").fadeIn("slow");
  }

  function convertUnixToDate(unixTime) {
    var date = new Date(unixTime*1000); // multiply by 1000 so no milliseconds
    var month = date.getMonth() + 1; //add 1 here because 0 = January (should be 1 = January)
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = (date.getMinutes() < 10 ? '0': '') + date.getMinutes(); // if minute < 10, add a "0" prefix so it shows up as 11:00 instead of 11:0

    // convert 24hr time to 12hr
    var timeSuffix = (hour < 12) ? "AM" : "PM";
    hour = (hour > 12) ? hour - 12 : hour;

    return month + "/" + day + " " + hour + ":" + minutes + timeSuffix;
  }
});
