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
    res.render('main',{temperature:null, humidity:null, windSpeed:null, weatherCondition:null,error:null,cityname:null,ImageURL:null})
});

app.post('/', function(req, res){
    const city = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=eff8c965bf27fa7738599df09e995594&units=metric";
    request(url, function(err,response,data){
            console.log(response.statusCode)
                const weatherData=JSON.parse(data);
                // console.log(weatherData);
                const temp = weatherData.main.temp;
                
                const humid = weatherData.main.humidity;
                
                const wind = weatherData.wind.speed;
                const weatherDescription = weatherData.weather[0].description;
                
                const icon =weatherData.weather[0].icon;
                const ImageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
                res.render('main',{temperature:temp, humidity:humid, windSpeed:wind, weatherCondition:weatherDescription, cityname:city, ImageURL:ImageURL})
        
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