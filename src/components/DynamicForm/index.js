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
        //alert(JSON.stringify(this.state));
        if (this.props.onSubmit) this.props.onSubmit(this.state);
    }
    renderForm = () => {
        let model = this.props.model;
        
        let formUI = model.map((m) => {
            let key = m.key;
            let type = m.type;
            let props = m.props || {};
            // Object.keys(props).forEach((key) => {
            //     console.log(key, props[key]);
            // })
            return (
                <div key={m.key} className="form-group">
                    <label className="form-label" 
                        key={"l" + m.key} htmlFor={m.key}>
                        {m.label}
                    </label>
                    <input {...props}
                        ref={(key)=> {this[m.key]=key}}
                        className="form-input"
                        type={type} key={"i" + m.key}  
                        onChange={(e)=>{ this.onChange(e, key)}}/>
                </div>
            );
        });
        return formUI;
    }
    render () {
        let title = this.props.title || "Dynamic Form";
        let show = this.props.show || false;
        console.log('df: ',show);
        if (!show) return null;
        
        return ( <div className={this.props.className}>
                <h3>{title}</h3>
                <form className="dynamic-form" onSubmit={(e)=> { this.onSubmit(e)}}>
                    {this.renderForm()}
                    <div className="form-group">
                        <button type="submit">submit</button>
                    </div>
                </form>
            </div>
        );
    }
}