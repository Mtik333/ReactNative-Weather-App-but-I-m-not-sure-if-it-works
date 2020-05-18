import React from 'react';
import {
  TabNavigator,
  StackNavigator
} from 'react-navigation';
import {
  Icon
} from 'react-native-elements';
import MainScreen from './MainScreen';
import AddLocationScreen from './AddLocationScreen';
import AllLocationsScreen from './AllLocationsScreen';
import AllLocationsScreen2 from './AllLocationsScreen2';
import DetailsScreen from './DetailsScreen';
import MapWebView from './MapWebView';
import ChartScreen from './ChartScreen';

export const WeatherStack = StackNavigator({
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      title: "Weather",
    },
  },

  AddLocationScreen: {
    screen: AddLocationScreen,
    navigationOptions: {
      title: "Add new location",
    }
  },

  AllLocationsScreen: {
    screen: AllLocationsScreen,
    navigationOptions: {
      title: "Locations",
    }
  },

  AllLocationsScreen2: {
    screen: AllLocationsScreen2,
    navigationOptions: {
      title: "My places",
    }
  },

  DetailsScreen: {
    screen: DetailsScreen,
    navigationOptions: {
      title: "Details",
    }
  },

  MapWebView:{
    screen: MapWebView,
    navigationOptions: {
      title: "Weather map",
    }
  },

  ChartScreen:{
    screen: ChartScreen,
    navigationOptions: {
      title: "Chart"
    }
  },

});

export const Tabs = TabNavigator({
  MainScreen: {
    screen: WeatherStack,
    navigationOptions: {
      tabBarLabel: 'WeatherApp',
      tabBarIcon: ({
        tintColor
      }) => < Icon name = "list"
      size = {
        35
      }
      color = {
        tintColor
      }
      />,
    },
  },
});

export const Root = StackNavigator({
  Tabs: {
    screen: Tabs,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});
