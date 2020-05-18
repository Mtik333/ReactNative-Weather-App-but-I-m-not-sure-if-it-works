var api = {
    baseUrl: "http://api.openweathermap.org/data/2.5/",
    mapUrl: "https://tile.openweathermap.org/map/",
    key: "",
    layer: "precipitation",
    imageUrl: "http://openweathermap.org/img/w/",
    uri: "https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation",
	dailyForecastUrl: "forecast",
    currentWeatherUrl: "weather",
    getLocation: function(latitude, longitude){
        let url = this.baseUrl + this.currentWeatherUrl + "?lat=" + latitude + "&lon=" + longitude + "&APPID="+this.key;
        return fetch(url).then((response) => response.json());
    },
    getCity: function(city){
        let url = this.baseUrl + this.currentWeatherUrl + "?q=" + city + "&APPID="+this.key;
        return fetch(url).then((response) => response.json());
    },
	getDailyForecastUrl: function(cityId) {
        let url = this.baseUrl + this.dailyForecastUrl + "?id=" + cityId + "&APPID="+this.key;
        console.log(url);
        return fetch(url).then((response) => response.json());
	},
	getCurrentWeatherUrl: function() {
		return this.baseUrl + this.currentWeatherUrl;
    },
    getMapTiles: function(x,y,z,layer){
        let url = this.mapUrl + layer + "/" + z + "/" + x + "/" + y + ".png&APPID=" + this.key;
        let url2 = this.uri + "&lat="+x+"&lon="+y+"&zoom="+10;
        console.log(url2);
        return url2;
    },
    getIcon: function(code) {
        let url = this.baseUrl + this.currentWeatherUrl + "/img/w/" + code + ".png";
        console.log(url);
        return fetch(url).then((response) => response.body);
    },
    getIconUrl: function(code){
        let url = this.imageUrl + code + ".png";
        console.log(url);
        return url;
    }
}
module.exports = api;