import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image, NetInfo, BackAndroid, Alert, ToastAndroid
} from 'react-native';
import api from '../WeatherAPI/api';
import DBHandler from '../Database/DBHandler';
let dbHandler = new DBHandler();
import Sound from 'react-native-sound';
import lodash from 'lodash';
class MainScreen extends Component {
  constructor(props) {
    super(props);
    Sound.setCategory('Playback', true);
    whoosh = new Sound('xpshutdown.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    });
    //Data passed as parameters for this screen
    const { navigation } = this.props;
    const name = navigation.getParam("name", null);
    const lat = navigation.getParam("lat", null);
    const long = navigation.getParam("long", null);

    if (name != null) {
      console.log("Setting work mode to 'from db'");
      console.log("Name from DB: " + name);
      console.log("Lat from DB: " + lat);
      console.log("Long from DB: " + long);

      this.state = {
        //0 - current location
        //1 - location came from db
        workMode: 1,
  
        name: name,
        latitude: lat,
        longitude: long,
        layer: "precipation",

        location: null,
        icon: null,
        temperature: null,
        pressure: null,
        windSpeed: null,
        windAngle: null,
        description: null,
      };
    }
    else {
      this.state = {
        //0 - current location
        //1 - location came from db
        workMode: 0,

        name: null,
        latitude: null,
        longitude: null,
        layer: "precipation",

        location: null,
        icon: null,
        temperature: null,
        pressure: null,
        windSpeed: null,
        windAngle: null,
        description: null,
      };
    }
    this.viewTiles=this.viewTiles.bind(this);
  }

  componentDidMount() {
    this.updateWeather();
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if (connectionInfo.type.localeCompare("none")==0){
        Alert.alert(
          "No Internet",
          "No Internet connection, exiting app",
          [
            {text: 'OK', onPress: () => BackAndroid.exitApp()},
          ],
          { cancelable: false }
        );
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
            whoosh.reset();
          }
        });
      }
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    });
  }

  currentLocationWeather(state) {
    this.updateWeather();
  }

  updateWeather() {
    console.log("Updating weather");
    navigator.geolocation.getCurrentPosition(
      (position) => {

        //When location comes from db this can not be overwritten
        if (this.state.workMode == 1) {
          console.log("Skipping location overwritten");
        } else {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }

        console.log("Latitude: " + this.state.latitude)
        console.log("Longtitude: " + this.state.longitude)
  
        console.log("Querying server for weather data");
        api.getLocation(this.state.latitude, this.state.longitude).then((response) =>{
          console.log("Response from sever: ");
          console.log(response);

          let location = response.name;
          this.setState({ location: location})
          console.log("Location: " + location);

          let iconCode = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
          this.setState({icon: iconCode});

          let temperature = ((response.main.temp - 273.16).toFixed(0)).toString() + " °C";
          let temperatureNoDegree = ((response.main.temp - 273.16).toFixed(0));
          this.setState({temperature: temperature});
          console.log("Temperature: " + temperature);

          let pressure = (response.main.pressure).toString() + " hPa";
          this.setState({pressure: pressure});
          console.log("Pressure: " + pressure);

          let windSpeed = (response.wind.speed).toString() + " km/h";
          this.setState({windSpeed: windSpeed});
          console.log("Wind speed: " + windSpeed*3600/1000);

          let windAngle = (response.wind.deg).toString() + " °";
          this.setState({windAngle: windAngle});
          console.log("Wind angle: " + windAngle);

          let description = (lodash.capitalize(response.weather[0].description));
          this.setState({description: description});

          dbHandler._addItem(response.id, response.name, response.coord.lat, response.coord.lon, parseInt(temperatureNoDegree), iconCode);
          if (this.state.cityId!=null){
            ToastAndroid.show('Updating weather', ToastAndroid.SHORT);
          }
          this.setState({cityId: response.id});
        });
      },
      (error) => {this.setState({ error: error.message }); console.log(error);},
      { enableHighAccuracy: false, timeout: 2000},
    );
  }

  viewTiles = (lat, lon, layer) =>{
    this.props.navigation.navigate('MapWebView', {lat: lat, lon: lon, layer: layer});
  }

  render() {
    
    return (
      <View style={styles.container}>
        <View style={{flexWrap: 'wrap', flexDirection: 'row', marginTop: 50}}>
          <Button height={50} width={100} title="Weather map" onPress={() => this.props.navigation.navigate('MapWebView', {lat: this.state.latitude, lon: this.state.longitude, layer: this.state.layer})}/>
          <View style={{flex:0.1}}/>
          <Button height={50} width={100} title="Weather here" onPress={() => {
            console.log("Setting work mode to 0");
            this.setState({workMode: 0});
            this.currentLocationWeather()
          }}/>
          <View style={{flex:0.1}}/>
          <Button height={100} width={100} title="My places"  onPress={()=> this.props.navigation.navigate("AllLocationsScreen2")}/>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 5,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            width: '100%',
          }}
        />
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.location}> {this.state.location} </Text>
          <Image style={{width: 100, height: 60}} source={{uri: this.state.icon}}></Image>
          <Text></Text>
          <Text style={styles.temperature}> {this.state.temperature} </Text>
          <Text style={styles.weatherType}> {this.state.description} </Text>
          <Text></Text>
          <View style={{flex:1, margin: 10}}>
          <Button title="Forecast" onPress={()=> this.props.navigation.navigate("DetailsScreen", {cityId: this.state.cityId})}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 50,
    fontWeight: "100",
    margin: 5
  },
  location: {
    fontSize: 34,
    fontWeight: "100",
    marginTop: 15,
    marginBottom: 15,
  },
  weatherType: {
    fontSize: 34,
    fontWeight: "500",
    margin: 5,
  },
});

export default MainScreen;