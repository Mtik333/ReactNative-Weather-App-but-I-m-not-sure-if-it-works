import React, { Component } from 'react';

import Realm from 'realm'

let realm = new Realm({
    schema: [{
        name: 'Cities',
        primaryKey: 'id',
        properties:{
            id: 'int',
            cityName: 'string',
            latitude: 'double',
            longitude: 'double',
            temperature: 'int',
            icon: 'string'
        },
    }]
})

let favs = realm.objects('Cities')

class DBHandler extends Component{
    constructor(props){
        super(props);
        this.state = {
            input: ''
        }
    }

    _addItem(id, cityName, latitude, longitude, temperature, icon){
        if (this._getFilteredId(id).length==0){
            console.log("writing");
            realm.write(()=>{
                realm.create('Cities', {
                    id: id,
                    cityName: cityName,
                    latitude: latitude,
                    longitude: longitude,
                    temperature: temperature,
                    icon: icon
                })
            })
        }
        else {
            console.log("it exists");
        }
    }

    _getFilteredId(cityId){
        return favs.filtered('id='+cityId);
    }

    _getAll(){
        return favs;
    }

    _clearDB(){
        realm.write(()=>{
            realm.deleteAll();
        })
    }

    _removeItem(cityId){
        var obj = this._getFilteredId(cityId);
        realm.write(()=>{
            realm.delete(obj);
        })
    }
    
    render(){
    }
}
export default DBHandler;