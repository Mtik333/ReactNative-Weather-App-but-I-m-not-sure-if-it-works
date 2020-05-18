import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  LayoutAnimation,
  ListView,
  Button,
  Image,
  BackHandler,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import Icon  from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import DBHandler from '../Database/DBHandler';
import lodash from 'lodash';

let dbHandler = new DBHandler();

var ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
class AllLocationsScreen2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentWillMount() {
    src = dbHandler._getAll();
    console.log(src);
    this.setState({
      'dataSource': this.state.dataSource.cloneWithRows(src),
      'data': src
    });
    console.log('xd');
  }

  shouldComponentUpdate(){
    src = dbHandler._getAll();
    console.log(src);
    this.setState({
      'dataSource': this.state.dataSource.cloneWithRows(src),
      'data': src
    });
    console.log('xd');
  }

  renderNews = (news) => {
    return (
      <TouchableOpacity style={styles.locationRow} onPress={()=> this.props.navigation.navigate("DetailsScreen", {cityId: news.id})}>
        <View style={styles.locationLeft}>
          <Text style={styles.locationNameText}>{news.cityName}</Text>
        </View>
        <View style={styles.locationRight}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Icon name="close" style={styles.actionButtonIcon2} onPress={()=> 
              {dbHandler._removeItem(news.id); 
              this.forceUpdate(); 
              this.shouldComponentUpdate();
              ToastAndroid.show('Location deleted', ToastAndroid.SHORT);}} />
            <Image style={styles.imageIcon} source={{ uri: news.icon }}></Image>
            <Text style={styles.locationTextHigh}>{news.temperature + " °C"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const didBlurSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.log('didFocus', payload);
        this.forceUpdate(); 
        this.shouldComponentUpdate();
      }
    );
    if (lodash.isEmpty(this.state.data) || this.state.dataSource.getRowCount() === 0) {
      return (
        <View style={{flex:1}}>
            <View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.locationNameText}>You have no favorite locations. Maybe add one?</Text>
            </View>
            <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#20F919' title="Add new" onPress={() => this.props.navigation.navigate("AddLocationScreen")}>
            <Icon name="plus" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#BF0AE4' title="Remove all" onPress={() => {}}>
            <Icon name="remove" style={styles.actionButtonIcon} onPress={() => 
              {dbHandler._clearDB(); 
              this.forceUpdate();
              ToastAndroid.show('Cleared all locations', ToastAndroid.SHORT);}}/>
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
          <ActionButton.Item buttonColor='#20F919' title="Add new" onPress={() => this.props.navigation.navigate("AddLocationScreen")}>
            <Icon name="plus" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#BF0AE4' title="Remove all" onPress={() => {}}>
            <Icon name="remove" style={styles.actionButtonIcon} onPress={() =>
              {dbHandler._clearDB(); 
              this.forceUpdate();
              ToastAndroid.show('Cleared all locations', ToastAndroid.SHORT);}}/>
          </ActionButton.Item>
        </ActionButton>
        </View>
      );
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
    fontSize: 16,
    fontWeight: "100",
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
    marginLeft: 3,
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
  },
  imageIcon:{
    alignItems: 'center',
    marginLeft: 15,
    width: 30,
    height: 30,
  },
  nolocations: {
    fontSize: 24,
    fontWeight: "100",
    color: 'black',
  },
});

export default AllLocationsScreen2;