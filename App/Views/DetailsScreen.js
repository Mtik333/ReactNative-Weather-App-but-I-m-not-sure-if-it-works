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
  Image,
  ListView,
  ScrollView,
  Button
} from 'react-native';
import Permissions from 'react-native-permissions'
import api from '../WeatherAPI/api';
import App from './App';
import Icon  from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import {VictoryBar, VictoryChart, VictoryTheme} from 'victory-native';
import lodash from 'lodash';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const sampledata = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const cityId = navigation.getParam("cityId", 0);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      cityId: cityId,
      dataSource: ds.cloneWithRows([])
    };
  }

  componentWillMount() {
    this.showForecast();
  }

  showForecast(){
    if (this.state.data==null){
      api.getDailyForecastUrl(this.state.cityId).then((response)=>{
        this.setState({
          'dataSource': this.state.dataSource.cloneWithRows(response.list),
          'data': response.list
        });
      });
    }
  }

  prettyDate(dt){
    var d = new Date(dt*1000);
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
    d.getHours() + ":" + d.getMinutes() + "" + (d.getMinutes()<10?"0":"");
    return datestring;
  }
  goToChart(variant){
    var myData=[];
    for (var i=0; i<this.state.data.length; i++){
      var time=this.state.data[i].dt*1000;
      console.log(time);
      var data=0;
      switch(variant){
        case "rain":
        if (!lodash.isEmpty(this.state.data[i].rain))
          var data=this.state.data[i].rain['3h'];
        else var data=0;
        break;
        case "cloud":
        var data=this.state.data[i].clouds.all;
        break;
        case "pressure":
        var data=this.state.data[i].main.pressure;
        break;
        case "wind":
        var data=this.state.data[i].wind.speed*3600/1000;
        break;
      }
      myData.push(new Object({time: time, data: data}))
    }
    this.props.navigation.navigate("ChartScreen", {data: myData, type: variant})
  }

  renderNews = (news) => {
    return (
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <Text style={styles.locationNameText}>
          {this.prettyDate(news.dt)}
            
            </Text>
        </View>
        <View style={styles.locationRight}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Image style={styles.imageIcon} source={{ uri: api.getIconUrl(news.weather[0].icon) }}></Image>
            <Text style={styles.locationTextHigh}>{((news.main.temp_min - 273.16).toFixed(0)).toString() + " °C"}</Text>
            <Text style={styles.locationTextHigh}>{((news.main.temp_max - 273.16).toFixed(0)).toString() + " °C"}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (lodash.isEmpty(this.state.data) || this.state.dataSource.getRowCount() === 0) {
      return(
      <View style={{flex:1}}>
        <View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Fetching data...</Text>
        </View>
         <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#DBDBDB' title="Cloud cover chart" onPress={() => {this.goToChart("cloud").bind(this)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-cloud-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#0011FF' title="Precipitation chart" onPress={() =>  {this.goToChart("rain").bind(this)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-rain-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#D8F69D' title="Wind chart" onPress={() =>  {this.goToChart("wind").bind(this)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-wind-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#EF5D5D' title="Atmospheric pressure chart" onPress={() => {this.goToChart("pressure").bind(this)}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-pressure-50.png')}></Image>
          </ActionButton.Item>
        </ActionButton>
      </View>
      );
    }
    else {
      return (
        <View style={{flex:1}}>
          <ScrollView ref="scrollView">
            {
              <ListView initialListSize={1} dataSource={this.state.dataSource} renderRow={this.renderNews.bind(this)}></ListView>
            }
          </ScrollView>
         <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#DBDBDB' title="Cloud cover chart" onPress={() => {this.goToChart("cloud")}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-cloud-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#0011FF' title="Precipitation chart" onPress={() => {this.goToChart("rain")}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-rain-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#D8F69D' title="Wind chart" onPress={() => {this.goToChart("wind")}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-wind-50.png')}></Image>
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#EF5D5D' title="Atmospheric pressure chart" onPress={() => {this.goToChart("pressure")}}>
          <Image style={{ width: 30, height: 30 }} source={require('../../Icons/icons8-pressure-50.png')}></Image>
          </ActionButton.Item>
        </ActionButton>
      </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8f8f8'
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#fff',
    paddingLeft: 14,
    paddingRight: 14,
    height: 72,
    borderColor: '#C8C7CC',
    borderBottomWidth: 0.3
  },
  locationLeft: {
    flex: 1,
    justifyContent: 'center'
  },
  locationNameText: {
    fontSize: 16
  },
  locationCurrentText: {
    fontSize: 16,
    color: '#B0B5BF'
  },
  locationRight: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },
  locationTextLow: {
    textAlign: 'right',
    marginLeft: 14,
    width: 20,
    color: '#B0B5BF',
    fontSize: 16
  },
  locationTextHigh: {
    textAlign: 'right',
    marginLeft: 5,
    marginRight: 5,
    width: 60,
    fontSize: 20
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  actionButtonIcon2: {
    fontSize: 20,
    paddingTop: 2,
    height: 30,
    color: 'red',
    marginRight: 15,
  },
  imageIcon:{
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    width: 30,
    height: 30,
  },
  temperature: {
    fontSize: 50,
    fontWeight: "100",
    margin: 5
  },
});
export default DetailsScreen;