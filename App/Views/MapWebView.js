import React, { Component } from 'react';
import { WebView, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import api from '../WeatherAPI/api';
import App from './App';
export default class MapWebView extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const lat = navigation.getParam("lat", 0);
        const long = navigation.getParam("lon", 0);
        const layer = navigation.getParam("layer", "precipitation");
        this.state = {
            lat: lat,
            long: long,
            layer: layer,
        }
    }

  render() {
    const uri = api.getMapTiles(this.state.lat, this.state.long, 10, this.state.layer);
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}