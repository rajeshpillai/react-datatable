import React, { Component } from 'react';
import ReactDOM from "react-dom"
import DataTable from './components/DataTable/DataTable';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [
        {title:"Id",accessor: "id", index: 0},
        {title:"Name",accessor: "name", width: 300, index: 0},
        {title:"Age",accessor: "age",index: 1},
        {title:"Qualification",accessor: "qualification",index:2},
        {title:"Rating",accessor: "rating",index:3,width: 200, cell: row => (
          <div  className="rating">
            <div style={{
              backgroundColor: "lightskyblue",
              height: "20px",
              width: (row/5) * 100  + "px",
              margin: "3px 0 4px 0"
           }}>{row}</div>
          </div>
        )},
        {title:"Profile",accessor:"profile", width: 200, index:4,cell:{
          type: "image",
          style: {
            "width": "50px",
          }
        }}
      ],
      data: [
          {id: 1, name:"a", age:29, qualification:"B.Com",rating:3,profile: "./img/img1.jpg"},
          {id: 2, name:"b", age:35, qualification:"B.Sc",rating:2,profile:"./img/img2.jpg"},
          {id: 3, name:"c", age:42, qualification:"B.E",rating:3,profile:"./img/img3.jpeg"},
        ]
    }

    var data = [];
    for(var i = 4; i <= 10; i ++) {
      data.push({
        id: i,
        name: "name " + i,
        age: i + 18,
        qualification: "Graduate",
        rating: (i%2 ? 3 : 4)
      })
    }
    this.state.data = [...this.state.data, ...data]
  }


  render() {
      return (
        <div className="App">
          <h3>Data Table </h3>
          <DataTable 
            keyField="id"
            pagination={{
              enabled: true,
              pageLength: 3,
              type: "long"
            }}
            width="600px"
            headers={this.state.headers} 
            data={this.state.data} 
            noData="No records!" />
        </div>
      );
  }
}
