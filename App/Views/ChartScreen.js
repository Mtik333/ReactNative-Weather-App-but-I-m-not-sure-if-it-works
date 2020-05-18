import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    ScrollView,
    Button,
    YellowBox,
    ToastAndroid
} from 'react-native';
import Permissions from 'react-native-permissions'
import api from '../WeatherAPI/api';
import App from './App';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import { VictoryLine, VictoryLabel, VictoryAxis, VictoryChart, VictoryTheme, VictoryBar } from 'victory-native';
import lodash from 'lodash';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
class ChartScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const type = navigation.getParam("type", "rain");
        const data = navigation.getParam("data", null);
        var xType="";
        if (type.localeCompare("rain")==0){
            var xType="mm"
        }
        else if (type.localeCompare("pressure")==0){
            var xType="hPa";
        }
        else if (type.localeCompare("wind")==0){
            var xType="km/h";
        }
        else var xType="%";

        var myDomain=[];
        myDomain.push(lodash.minBy(data, 'data')-5);
        myDomain.push(lodash.maxBy(data, 'data')+5);
        var myData = [];
        for (var i = 0; i < data.length; i++) {
            myData.push(data[i].data);
        }
        var myData2 = [];
        for (var i = 0; i < data.length; i++) {
            myData2.push(new Date(data[i].time));
        }
        this.state = {
            error: null,
            data: data,
            type: type,
            loaded: false,
            domain: myDomain,
            dataValues: myData,
            timeValues: myData2,
            xType: xType,
        };
    }

    componentWillMount() {
        this.setState({loaded: true});
    }

    componentDidMount() {
        console.log(this.state.data);
        this.setState({loaded: true});
    }

    getDataValues() {
        return this.state.dataValues;
    }

    getTickValues() {
        return this.state.timeValues;
    }

    render() {
        //const styles = this.getStyles();
        const tickValues = this.getTickValues();
        if (this.state.loaded){
            return (
                <View style={{flex:1}}>
                    <Text style={styles.temperature}>Values in {this.state.xType}</Text>
                <VictoryChart 
                padding={{ top: 30, left: 50, right: 50, bottom: 30 }}
                scale={{ x: "time" }}
        >
            <VictoryLine
              style={{
                data: { stroke: "tomato" }
              }}
              data={this.state.data}
              x="time"
              y="data"
            />

          </VictoryChart>
          </View>
            );
        }
        else {
            return (
                <VictoryChart
                theme={VictoryTheme.material}
            >
                <VictoryAxis 
                domain={domain.xDomain} 
                fixLabelOverlap={true}
                tickFormat={(v) => v.toString()}/>
                <VictoryAxis dependentAxis/>
                <VictoryBar horizontal
                    style={{ data: { fill: "#c43a31" } }}
                    alignment="start"
                    data={[0, 1]}

                />
            </VictoryChart>
            );
        }
    }

    getStyles() {
        const BLUE_COLOR = "#00a3de";
        const RED_COLOR = "#7c270b";

        return {
            parent: {
                background: "#ccdee8",
                boxSizing: "border-box",
                display: "inline",
                padding: 0,
                fontFamily: "'Fira Sans', sans-serif",
                maxWidth: "50%",
                height: "auto"
            },
            title: {
                textAnchor: "start",
                verticalAnchor: "end",
                fill: "#000000",
                fontFamily: "inherit",
                fontSize: "18px",
                fontWeight: "bold"
            },
            labelNumber: {
                textAnchor: "middle",
                fill: "#ffffff",
                fontFamily: "inherit",
                fontSize: "14px"
            },

            // INDEPENDENT AXIS
            axisYears: {
                axis: { stroke: "black", strokeWidth: 1 },
                ticks: {
                    size: (tick) => {
                        const tickSize =
                            tick.getFullYear() % 5 === 0 ? 10 : 5;
                        return tickSize;
                    },
                    stroke: "black",
                    strokeWidth: 1
                },
                tickLabels: {
                    fill: "black",
                    fontFamily: "inherit",
                    fontSize: 16
                }
            },

            // DATA SET ONE
            axisOne: {
                grid: {
                    stroke: (tick) =>
                        tick === -10 ? "transparent" : "#ffffff",
                    strokeWidth: 2
                },
                axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
                ticks: { strokeWidth: 0 },
                tickLabels: {
                    fill: BLUE_COLOR,
                    fontFamily: "inherit",
                    fontSize: 16
                }
            },
            labelOne: {
                fill: BLUE_COLOR,
                fontFamily: "inherit",
                fontSize: 12,
                fontStyle: "italic"
            },
            lineOne: {
                data: { stroke: BLUE_COLOR, strokeWidth: 4.5 }
            },
            axisOneCustomLabel: {
                fill: BLUE_COLOR,
                fontFamily: "inherit",
                fontWeight: 300,
                fontSize: 21
            },

            // DATA SET TWO
            axisTwo: {
                axis: { stroke: RED_COLOR, strokeWidth: 0 },
                tickLabels: {
                    fill: RED_COLOR,
                    fontFamily: "inherit",
                    fontSize: 16
                }
            },
            labelTwo: {
                textAnchor: "end",
                fill: RED_COLOR,
                fontFamily: "inherit",
                fontSize: 12,
                fontStyle: "italic"
            },
            lineTwo: {
                data: { stroke: RED_COLOR, strokeWidth: 4.5 }
            },

            // HORIZONTAL LINE
            lineThree: {
                data: { stroke: "#e95f46", strokeWidth: 2 }
            }
        };
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
        fontSize: 30,
        fontWeight: "100",
        margin: 15,
        textAlign: 'center',
        color: '#000000'
    },
});

export default ChartScreen;