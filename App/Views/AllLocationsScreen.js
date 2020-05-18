/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Permissions from 'react-native-permissions'
import api from '../WeatherAPI/api';
import Mapbox, { MapView } from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoibXRpazMzMyIsImEiOiJjamk1cW4yNDYwa3AzM3FyMHJmNnhxd2t1In0.Rb175HjDo6et0CQzMUAOWQ');

class AllLocationsScreen extends Component {

  componentDidMount(){
    console.log(Mapbox);
  }

  render() {
    return (
      <View style={styles.container}>
      <Button title="Dodaj lokalizacja" onPress={()=> this.props.navigation.navigate("AddLocationScreen")}/>   

      <Button title="Testowy przycisk/ mozna usunac" onPress={()=> {
        let name = "Warszawa";
        let lat = 40;
        let long = 10;
        this.props.navigation.navigate("MainScreen", {name: name, lat: lat, long: long})
      }}/>
      <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default AllLocationsScreen;