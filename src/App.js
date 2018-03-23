import React, { Component } from 'react';
import ReactDOM from "react-dom"
import DataTable from './components/DataTable/DataTable';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [
        {title:"Name",accessor: "name", width: 300, index: 0},
        {title:"Age",accessor: "age",index: 1},
        {title:"Qualification",accessor: "qualification",index:2},
        {title:"Rating",accessor: "rating",index:3, cell: row => (
          <div style={{
              backgroundColor: "yellow",
              width: row * 10 + "px"
          }}>
            {row}
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
          {name:"a", age:29, qualification:"B.Com",rating:3,profile: "./img/img1.jpg"},
          {name:"b", age:35, qualification:"B.Sc",rating:2,profile:"./img/img2.jpg"},
          {name:"c", age:42, qualification:"B.E",rating:3,profile:"./img/img3.jpeg"},
        ]
    }

    var data = [];
    for(var i = 1; i <= 10; i ++) {
      data.push({
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
            headers={this.state.headers} 
            data={this.state.data} 
            noData="No records!" />
        </div>
      );
  }
}
