import React from 'react';
import ReactDOM from 'react-dom';
import './datatable.css';

export default  class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this.noData = props.noData || "No Records found!!";
        this.width = props.width || "100%";
    }

    state = {
        headers: this.props.headers,
        data: this.props.data,
        sortby: null,
        descending: false,
        edit: null, // {row: index, cell: index}
        search: false
    }

    _preSearchData = null

    onSort=(e) => {
        var data = this.state.data.slice();
        var column = ReactDOM.findDOMNode(e.target).parentNode.cellIndex; 
        var colTitle = e.target.dataset.col;
        //column = e.target.cellIndex;
        var descending = this.state.sortby === column && !this.state.descending;
        data.sort((a,b) => {
            var sortVal = 0;
            console.log(`${a[colTitle]} - ${b[colTitle]}`)
            if (a[colTitle] < b[colTitle]) {
                sortVal = -1;
            } else if (a[colTitle] > b[colTitle]){
                sortVal = 1;
            }
            if (descending) {sortVal = sortVal * -1;}
            return sortVal;
        });
        this.logSetState({
            data: data,
            sortby: column,
            descending
        });
    }

    onShowEditor = (e) => {
        this.logSetState({ 
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                cell: e.target.cellIndex
            }
        });
    }

    onSave = (e) => {
        e.preventDefault();
        var input = e.target.firstChild;

        var header  = this.state.headers[this.state.edit.cell];

        // Clone the data
        var data = this.state.data.slice();

        // Update the data
        //data[this.state.edit.row][this.state.edit.cell] = input.value;
        data[this.state.edit.row][header.accessor]= input.value;

        // Update state
        this.logSetState({
            edit: null, // done editing
            data: data
        });

    }

    onToggleSearch = () => {
        if (this.state.search) {
            this.logSetState({
                data: this._preSearchData,
                search: false
            });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this.logSetState({
                search: true
            });
        }
    }

    onSearch = (e) => {
        var needle = e.target.value.toLowerCase();
        if (!needle) {
            this.logSetState({
                data: this._preSearchData
            })
            return;
        }
        var idx = e.target.dataset.idx;
        console.log("searching: ", needle,idx);
        var searchdata = this._preSearchData.filter((row) => {
            let colName = Object.keys(row)[idx];
            console.log(row);
            return row[colName].toString().toLowerCase().indexOf(needle) > -1;
        });
        this.logSetState({
            data: searchdata
        });
    }

    renderSearch = () => {
        if (!this.state.search) {
            return null;
        }
        return (
            <tr onChange={this.onSearch}>
                {this.state.headers.map((_ignore, idx) => {
                    return (<td key={idx}>
                            <input type="text" data-idx={idx} />
                        </td>
                    );
                })}
            </tr>
        );
    }

    _log = []

    logSetState = (newState) => {
        // remember the old state in a clone
        if (this._log.length === 0) {
            this._log.push(JSON.parse(JSON.stringify(this.state)));
        }
        this._log.push(JSON.parse(JSON.stringify(newState)));
        this.setState(newState);
    }
    
    onDragStart = (e, source) => {
        console.log('dragstart:',source);
        e.dataTransfer.setData("source", source);
    }

    onDrag = (ev, id) => {
        console.log('drag:',id);
    }

    onDragover = (e) => {
        e.preventDefault();
    }

    onDrop = (e, target) => {
        e.preventDefault();
        var source = e.dataTransfer.getData("source");
        console.log(`DROPPED  ${source} at ${target}`);
        var headers = [...this.state.headers];
        var srcHeader = headers[source];
        var targetHeader = headers[target];

        var temp = srcHeader.index;
        srcHeader.index = targetHeader.index;
        targetHeader.index = temp;

        this.logSetState({
            headers
        })

    }

    renderTable = () => {
        var {headers,data} = this.state;

        headers.sort((a, b) => {
            if (a.index > b.index) return 1;
            return -1;
        })
        var headerView = headers.map((header, index) => {
            let title = header.title;
            let cleanTitle = header.accessor;
            let width = header.width;
            if (this.state.sortby === index) {
                title += this.state.descending ? '\u2191': '\u2193'
            }
            return (
                <th key={index} 
                    ref={(th)=>this.th=th}
                    style={{width: width}}
                    data-col={cleanTitle}
                    onDragStart={(e)=>this.onDragStart(e, index)}
                    onDrag={(e)=>this.onDrag(e, index)}
                    onDragOver={(e)=>this.onDragover(e)}
                    onDrop={(e) =>{this.onDrop(e, index)}} >
                    <span 
                        data-col={cleanTitle}
                        draggable className="header-cell">
                        {title}
                    </span>
                </th>
            )
        });

        var contentView = data.map((row, rowIdx) => {
            var edit = this.state.edit;
            return (<tr key={rowIdx}>
                 {
                    // Loop through headers 
                    headers.map((header, index) => {
                    // Get the content for the header.  This will work with col reordering.
                    let content = row[header.accessor];
                    let cell = header.cell; // row[header.colRenderer];
                    if (cell) {
                        if (typeof(cell) === "object") {
                            if (cell.type === "image" && content) {
                                content = <img style={cell.style} src={content} />
                            }
                        } else if (typeof(cell) === "function") {
                            content = cell(content);
                        }
                    }
                    if (edit && edit.row === rowIdx && edit.cell===index) {
                        content = <form onSubmit={this.onSave}>
                            <input type="text" defaultValue={content} />
                        </form>
                    }
                    return (
                        <td key={index} 
                            data-row={rowIdx}>
                            { content }
                        </td>
                    );
                })}
            </tr>);
        });

        return (
            <table className="data-table" border="1" style={{width: this.width}}>
                <thead onClick={this.onSort}>
                    <tr>
                        {headerView}
                    </tr>
                </thead>
                <tbody onDoubleClick={this.onShowEditor}>
                    {this.renderSearch()}
                    {!this.state.data.length && this.noData}
                    {this.state.data && contentView}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div>
                 {this.renderTable()}
            </div>
        )
    }
}