const express = require("express");
const app = express();
// const https = require("https");
const bodyParser = require("body-parser");
const { url } = require("inspector");
const { TIMEOUT } = require("dns");
const request = require("request");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('main',{temperature:null, humidity:null, windSpeed:null, weatherCondition:null,error:null,cityname:null,ImageURL:null,airPressure:null,feelsLike:null,Sunrise:null,Sunset:null})
});

app.post('/', function(req, res){
    const city = req.body.cityName;
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=eff8c965bf27fa7738599df09e995594&units=metric";
    
    request(url, function(err, response, data) {
        if (err) {
            // Handle network or request-related errors
            console.error('Error occurred:', err);
            res.render('main', { error: 'City not found or API request failed.',cityname:city+" not found",temperature:'-',humidity: '-',
            windSpeed: '-',
            weatherCondition: '-',
            
            ImageURL: '-',
            airPressure: '-',
            feelsLike: '-',
            Sunrise: '-',
            Sunset:  '-' });
        } else {
            if (response.statusCode === 200) {
                const weatherData=JSON.parse(data);
                const temp = Math.round(weatherData.main.temp);
                
                const humid = weatherData.main.humidity;
                
                const wind = weatherData.wind.speed;
                const weatherDescription = weatherData.weather[0].description;
                const feelsLike = Math.round(weatherData.main.feels_like);
                const airPress = weatherData.main.pressure;
                const unixTimeRise = weatherData.sys.sunrise;
                const unixTimeSet = weatherData.sys.sunset;
                // Function to convert Unix timestamp to 12-hour time format (AM/PM)
function convertTo12HourFormat(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    const milliseconds = unixTimestamp * 1000;
  
    // Create a Date object with the milliseconds
    const date = new Date(milliseconds);
  
    // Get the hours and minutes from the Date object
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Convert hours to 12-hour format (AM/PM)
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
  
    // Format the time in 12-hour format
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }
  const sunriseTime = convertTo12HourFormat(unixTimeRise);
  const sunsetTime = convertTo12HourFormat(unixTimeSet);  
                
                const icon =weatherData.weather[0].icon;
                const ImageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
                res.render('main', {
                    temperature: temp,
                    humidity: humid,
                    windSpeed: wind,
                    weatherCondition: weatherDescription,
                    cityname: capitalizedCity,
                    ImageURL: ImageURL,
                    airPressure: airPress,
                    feelsLike: feelsLike,
                    Sunrise: sunriseTime,
                    Sunset: sunsetTime
                });
            } else {
                // Handle other HTTP status codes (e.g., 404, 401, etc.)
                console.error('Error occurred. Status Code:', response.statusCode);
                res.render('main', { error: 'City not found or API request failed.',cityname:city+" not found",temperature:'-',humidity: '-',
                windSpeed: '-',
                weatherCondition: '-',
                
                ImageURL: '-',
                airPressure: '-',
                feelsLike: '-',
                Sunrise: '-',
                Sunset:  '-'});
            }
        }
    });
});
// ,{temperature:temp, humidity:humid, windSpeed:wind, weatherCondition:weatherDescription}



app.listen(3000, function(){
    console.log("The server is running on port 3000");
});






// const url = "https://api.openweathermap.org/data/2.5/weather?q=Alibag&appid=eff8c965bf27fa7738599df09e995594&units=metric";
//     https.get(url, function(response){
//         console.log(response.statusCode);
//         response.on('data',function(data){
//             console.log(data);
//         });