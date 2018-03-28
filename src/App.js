import React, { Component } from 'react';
import ReactDOM from "react-dom"
import DataTable from './components/DataTable/DataTable';
import DynamicForm from './components/DynamicForm';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [
        {title:"Id",accessor: "id", index: 0},
        {title:"Profile",accessor:"profile", width: 80, index:1,cell:{
          type: "image",
          style: {
            "width": "50px",
          }
        }},
        {title:"Name",accessor: "name", width: 300, index: 2},
        {title:"Age",accessor: "age",index: 3},
        {title:"Qualification",accessor: "qualification",index:4},
        {title:"Rating",accessor: "rating",index:3,width: 200, cell: row => (
          <div  className="rating">
            <div style={{
              backgroundColor: "lightskyblue",
              textAlign:"center",
              height: "1.9em",
              width: (row/5) * 201  + "px",
              margin: "3px 0 4px 0"
           }}>{row}</div>
          </div>
        )},
      ],
      data: [
          {id: 1, name:"a", age:29, qualification:"B.Com",rating:3,profile: "./img/profile.png"},
          {id: 2, name:"b", age:35, qualification:"B.Sc",rating:5,profile:"./img/profile.png"},
          {id: 3, name:"c", age:42, qualification:"B.E",rating:3,profile:"./img/profile.png"},
        ]
    }

    var data = [];
    for(var i = 4; i <= 20; i ++) {
      data.push({
        id: i,
        name: "name " + i,
        age: i + 18,
        qualification: "Graduate",
        rating: (i%2 ? 3 : 4),
        profile: "./img/profile.png"
      })
    }
    this.state.data = [...this.state.data, ...data]
  }


  render() {
      return (
        <div className="App">
          <h3>Data Table </h3>
          <DynamicForm 
            model={[
              {key: "name", label: "Name", props: {required: true}},
              {key: "age",label: "Age", type: "number"},
              {key: "rating",label: "Rating", type: "number", props:{min:0,max:5}},
              {key: "qual",label: "Qualification"},
              
            ]}
          />
          <DataTable 
            keyField="id"
            pagination={{
              enabled: true,
              pageLength: 10,
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
