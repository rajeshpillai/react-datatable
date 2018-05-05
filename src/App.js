import React, { Component } from 'react';
import ReactDOM from "react-dom"
import DataTable from './components/DataTable/DataTable';
import DynamicForm from './components/DynamicForm';
import './App.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    let model = {
      headers: [
        {title:"Id",accessor: "id", index: 0, dataType: "number"},
        {title:"Profile",accessor:"profile", width: 80, index:1,cell:{
          type: "image",
          style: {
            "width": "50px",
          }
        }},
        {title:"Name",accessor: "name", width: 300, index: 2,dataType: "string"},
        {title:"Age",accessor: "age",index: 3, dataType: "number"},
        {title:"Qualification",accessor: "qualification",index:4,
                dataType: "string"},
        {title:"Rating",accessor: "rating",index:3,width: 200,
          dataType: "custom",
          cell: row => (
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
          {id: 1, name:"a", age:29, qualification:"B.Com",rating:3,profile: "https://png.icons8.com/nolan/50/000000/user.png"},
          {id: 2, name:"b", age:35, qualification:"B.Sc",rating:5,profile:"https://png.icons8.com/nolan/50/000000/user.png"},
          {id: 3, name:"c", age:42, qualification:"B.E",rating:3,profile:"https://png.icons8.com/nolan/50/000000/user.png"},
        ]
    }

    var data = [];
    for(var i = 4; i <= 20; i ++) {
      model.data.push({
        id: i,
        name: "name " + i,
        age: i + 18,
        qualification: "Graduate",
        rating: (i%2 ? 3 : 4),
        profile: "https://png.icons8.com/dotty/50/000000/cat-profile.png"
      })
    }
    this.state = model;
  }

  // From dynamic form
  onSubmit = (model) => {
    alert(JSON.stringify(model));
    model.id = +new Date()
    this.setState({
      data: [model, ...this.state.data]
    })

  }

  onUpdateTable = (field, id, value) => {
    alert(id);

    // Clone the data
    var data = this.state.data.slice();

    var updateRow = this.state.data.find((d) => {
        return d["id"] == id;
    })

    updateRow[field] = value;

    // Update state
    this.setState({
        edit: null, // done editing
        data: data
    });
  }

  render() {
    console.log("APP:RENDER", this.state.data);
      return (
        <div className="app">
          <DynamicForm className="form" show={false}
            title = "Registration"
            model={[
              {key: "name", label: "Name", props: {required: true}},
              {key: "age",label: "Age", type: "number"},
              {key: "rating",label: "Rating", type: "number", props:{min:0,max:5}},
              {key: "qualification",label: "Qualification"},
            ]}
            onSubmit = {(model)=> {this.onSubmit(model)}}
          />
           <DataTable className="data-table"
            title="USER PROFILES"
            keyField="id"
            edit={true}
            pagination={{
              enabled: true,
              pageLength: 5,
              type: "long"  // long, short
            }}
            width="100%"
            headers={this.state.headers}
            data={this.state.data}
            noData="No records!"
            onUpdate={this.onUpdateTable}/>
        </div>
      );
  }
}
