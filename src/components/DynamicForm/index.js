import React from 'react';
import ReactDOM from 'react-dom';
import './form.css';

export default  class DynamicForm extends React.Component {
    state = {
    }
    constructor(props) {
        super(props);
        console.log("model: ",props.model);
    }

    onChange = (e, key) => {
        this.setState({
            [key]: this[key].value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        alert(JSON.stringify(this.state));
    }
    renderForm = () => {
        let model = this.props.model;

        let formUI = model.map((m) => {
            let key = m.key;
            return (
                <div key={m.key} className="form-group">
                    <label className="form-label" 
                        key={m.key} htmlFor={m.key}>
                        {m.label}
                        <input 
                            ref={(key)=> {this[m.key]=key}}
                            className="form-input"
                            type="text" key={m.key}  
                            onChange={(e)=>{ this.onChange(e, key)}}/>
                    </label>
                </div>
            );
        });
        return formUI;
    }
    render () {
        return (
            <div>
                <h3>Dynamic Form</h3>
                <form className="dynamic-form" onSubmit={(e)=> { this.onSubmit(e)}}>
                    {this.renderForm()}
                    <input type="submit" value="submit" />
                </form>
            </div>
        );
    }
}