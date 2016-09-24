$(document).ready(function() {
  $("#searchButton").click(function() {
    console.log("search clicked");
    $.get("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=f1bd4a0fa665e173cfc001f3bdd1d429", function(data, status){
      console.log("Data: " + data + "\nStatus: " + status);
    });
  });
});
