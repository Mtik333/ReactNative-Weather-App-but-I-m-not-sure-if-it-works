import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  WebView,
  Linking,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableHighlight
} from 'react-native';

import Permissions from 'react-native-permissions'
import api from '../WeatherAPI/api';
import renderIf from '../renderIf';

import Geocoder from 'react-native-geocoding';
import Mapbox, { MapView } from '@mapbox/react-native-mapbox-gl';
import DBHandler from '../Database/DBHandler';
let dbHandler = new DBHandler();
import Sound from 'react-native-sound';
Mapbox.setAccessToken('pk.eyJ1IjoibXRpazMzMyIsImEiOiJjamk1cW4yNDYwa3AzM3FyMHJmNnhxd2t1In0.Rb175HjDo6et0CQzMUAOWQ');

class MainScreen extends Component {
  constructor(props) {
    super(props);
    Sound.setCategory('Playback', true);
    whoosh = new Sound('chord.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    });
    this.state = {
      latitude: null,
      longitude: null,

      searchByCityVisible: false,
      searchName: "",
      searchLongName: null,

      searchByCoordinatesVisible: false,
      searchByCoordinatesName: "",

      searchByMapVisible: false,
      savedLocation: false,
    };
  }

  updateSearchByCityVisibility(visibility) {
    this.setState({searchByCityVisible: visibility});
  }

  updateSearchByCoordinatesVisibility(visibility) {
    this.setState({searchByCoordinatesVisible: visibility});
  }

  updateSearchByMapVisibility(visibility) {
    this.setState({modalVisearchByMapVisiblesible: visibility});
  }

  componentDidMount() {
  }

  saveToDatabaseCity() {
    api.getCity(this.state.searchLongName).then((response) =>{
      let iconCode = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let temperatureNoDegree = ((response.main.temp - 273.16).toFixed(0));
      dbHandler._addItem(response.id, response.name, response.coord.lat, response.coord.lon, 
        parseInt(temperatureNoDegree), iconCode);
    });
  }

  saveToDatabaseCoordinates() {
    console.log("Saving to database");
    api.getLocation(Number(this.state.latitude), Number(this.state.longitude)).then((response) =>{
      let iconCode = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let temperatureNoDegree = ((response.main.temp - 273.16).toFixed(0));
      dbHandler._addItem(response.id, this.state.searchByCoordinatesName, Number(this.state.latitude), 
      Number(this.state.longitude), parseInt(temperatureNoDegree), iconCode);
    });
  }

  saveToDatabase() {
    api.getLocation(this.state.latitude, this.state.longitude).then((response) =>{
      let iconCode = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let temperatureNoDegree = ((response.main.temp - 273.16).toFixed(0));
      dbHandler._addItem(response.id, response.name, response.coord.lat, response.coord.lon, 
        parseInt(temperatureNoDegree), iconCode);
    });
  }

  render() {
    const uri = "https://openweathermap.org/weathermap?basemap=map&cities=true&layer=precipitation&lat=53.1352&lon=23.1413&zoom=10";
    return (
      <View style={styles.container}>

        <Modal
          animationType="slide" transparent={false}
          visible={this.state.searchByCityVisible} onRequestClose={()=> console.log("A")}>
          <View style={{marginTop: 22, padding:10}}>
            <View>
              <Text>Search for location by city name</Text>

              <View style={{flexDirection: "column", marginTop: 10}}>
                <TextInput value={this.state.searchName} onChangeText={(username) => 
                  this.setState({searchName: username})}/>

                  <Button title="Search" onPress={()=> {
                    console.log("Searching for location named: " + this.state.searchName);

                    Geocoder.init('AIzaSyDscaWzq0FFGQ59pLA2GaXPYJoakb8rcFk');
                    Geocoder.from(this.state.searchName)
                    .then(json => {
                      console.log("Found location");
                      console.log(json);

                      let longName = json.results[0].address_components[0].long_name;
                      console.log("Long name: " + longName);
                      let lat = json.results[0].geometry.location.lat;
                      console.log("Lat: " + lat);
                      let lng = json.results[0].geometry.location.lng;
                      console.log("Long: " + lng);

                      this.setState({searchLongName: longName, latitude: lat, longitude: lng})
                    })
                    .catch(error => {
                      console.log(error);
                      console.log("Location has not been found");
                      whoosh.play((success) => {
                        if (success) {
                          console.log('successfully finished playing');
                        } else {
                          console.log('playback failed due to audio decoding errors');
                          whoosh.reset();
                        }
                      });
                      Alert.alert("Location could not be found");
                    });
                  }}/>
              </View>
              <View style={{marginTop: 42}}>
                <Text>Name: {this.state.searchLongName}</Text>
                <Text>Latitude: {this.state.latitude}</Text>
                <Text>Longitude: {this.state.longitude}</Text>
                
                <View style={{flexDirection: 'row', marginTop: 22}}>
                  <View style={{flex: 2, marginRight: 10}}>
                    <Button title="Save location" onPress={() => {
                      this.updateSearchByCityVisibility(!this.state.searchByCityVisible); 
                      this.saveToDatabaseCity();
                    }}/>
                  </View>

                  <View>
                    <Button title="Cancel" onPress={() => {
                      this.updateSearchByCityVisibility(!this.state.searchByCityVisible); 
                    }}/>
                  </View>
                </View>

              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide" transparent={false}
          visible={this.state.searchByCoordinatesVisible} onRequestClose={()=> console.log("A")}>
          <View style={{marginTop: 22, padding:10}}>
            <View>
              <View>
                <View>
                  <Text>Location title</Text>
                  <TextInput value={this.state.searchByCoordinatesName} onChangeText={(name) => 
                    this.setState({searchByCoordinatesName: name})}/>
                </View>

                <View style={{marginTop: 32}}>
                  <Text>Latitude</Text>
                  <TextInput value={this.state.latitude} onChangeText={(name) => 
                    this.setState({latitude: name})} keyboardType={"numeric"}/>
                </View>

                <View style={{marginTop: 32}}>
                  <Text>Longitude</Text>
                  <TextInput value={this.state.longitude} onChangeText={(name) => 
                    this.setState({longitude: name})} keyboardType={"numeric"}/>
                </View>
              </View>

              <View style={{flexDirection: 'row', marginTop: 22}}>
                <View style={{flex: 2, marginRight: 10}}>
                  <Button title="Save location" onPress={() => {
                    this.updateSearchByCoordinatesVisibility(!this.state.searchByCoordinatesVisible); 
                    this.saveToDatabaseCoordinates();
                  }}/>
                </View>

                <View>
                  <Button title="Cancel" onPress={() => {
                    this.updateSearchByCoordinatesVisibility(!this.state.searchByCoordinatesVisible); 
                  }}/>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{flex:2 , marginRight:10}}>
            <Button title="Search by city name" onPress={() => { this.updateSearchByCityVisibility(true); }} />
          </View>

          <View>
            <Button title="Enter coordinates" onPress={() => { this.updateSearchByCoordinatesVisibility(true); }} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
export default MainScreen;