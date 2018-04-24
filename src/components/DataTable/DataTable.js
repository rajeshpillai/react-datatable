import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from './Pagination';
import './datatable.css';

export default  class DataTable extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            data: props.data,
            pagedData: props.data,
            sortby: null,
            descending: false,
            edit: null, // {row: index, cell: index}
            search: false,
            pageLength: props.pagination.pageLength
        }

        this.keyField = props.keyField || "id";   // default 'id'
        this.noData = props.noData || "No Records found!!";
        this.width = props.width || "100%";
        this.currentPage = 1;
        this.setupPagination();
    }

    setupPagination = () => {
        this.pagination = this.props.pagination || {};
        this.paginationType  = this.props.pagination.type || "short";
        this.pageLength = this.props.pagination.pageLength || 5;
        this.totalRecords = this.props.data.length;
        this.pages = Math.ceil(this.totalRecords / this.pageLength);
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
        this.setState({
            data: data,
            sortby: column,
            descending
        });

        this.onGotoPage(null, this.currentPage);
    }

    onShowEditor = (e) => {
        let id = e.target.dataset.id;
        console.log(`editing row with id-> ${id}`);

        this.setState({ 
            edit: {
                row: parseInt(e.target.dataset.row, 10),
                rowId: id,
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
        var rowId = this.state.edit.rowId;
        // Update the data
        //data[this.state.edit.row][header.accessor]= input.value;

        var updateRow = this.state.data.find((d) => {
            return d[this.keyField] == rowId;
        })

        console.log("found: ", updateRow);

        updateRow[header.accessor] = input.value;

        // Update state
        this.setState({
            edit: null, // done editing
            data: data
        });

    }

    onToggleSearch = () => {
        if (this.state.search) {
            this.setState({
                data: this._preSearchData,
                search: false
            });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this.setState({
                search: true
            });
        }
    }

    onSearch = (e) => {
        var needle = e.target.value.toLowerCase();
        if (!needle) {
            this.setState({
                data: this._preSearchData
            })
            return;
        }
        var idx = e.target.dataset.idx;
        console.log("TARGET COL: ", this.state.headers[idx]);
        let targetCol = this.state.headers[idx].accessor;
        var searchdata = this._preSearchData.filter((row) => {
            //let colName = Object.keys(row)[idx];
            console.log(`searching ${targetCol}`)
            return row[targetCol].toString().toLowerCase().indexOf(needle) > -1;
        });
        this.setState({
            data: searchdata,
            pagedData: searchdata
        });

        // if (this.pagination.enabled) {
        //     this.onGotoPage(null, this.currentPage);
        // }
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

    renderToolbar = () =>{
        return (
            <div className="toolbar">
                <button 
                    onClick={this.onToggleSearch}>search</button>
            </div>
        );
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

        this.setState({
            headers
        })

    }


    onGotoPage = (e, pageNo) => {
        console.log("onGotoPage: ", pageNo, this.state.pageLength);
        this.currentPage = pageNo;
        let pagedData = this.getPagedData(pageNo, this.state.pageLength);
        this.setState({
            pagedData: pagedData
        });        
    }

    onPageLengthChange = (pageLength) => {
        this.setState({
            pageLength: parseInt(pageLength,10)  
        }, () => {
            this.onGotoPage(null, this.currentPage);
        });
    }

    getPagedData =  (pageNo, pageLength) => {
        console.log(`getting paged data for pageno ${pageNo} and records per page ${pageLength}`)
        let startOfRecord = (pageNo - 1) * pageLength;
        let endOfRecord = startOfRecord + pageLength;
        let pagedData = this.state.data.slice(startOfRecord, endOfRecord);
        return pagedData;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.length != this.state.data.length) {
            this.setState({
                data: nextProps.data
            })
        }
    }

    componentDidMount() {
        console.log("cDM: ", this.currentPage);
        if (this.pagination.enabled) {
            this.onGotoPage(null, this.currentPage);
        }
    }

    _renderTableHeader = () => {
        var {headers} = this.state;
        let data = this.pagination.enabled ?  this.state.pagedData : this.state.data;

        headers.sort((a, b) => {
            if (a.index > b.index) return 1;
            return -1;
        });

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
        return headerView;
    }
    
    _renderContent = () => {
        var {headers} = this.state;
        let data = this.pagination.enabled ?  this.state.pagedData : this.state.data;

        var contentView = data.map((row, rowIdx) => {
            var edit = this.state.edit;
            let id =  row[this.keyField];
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
                            data-id={id} 
                            data-row={rowIdx}>
                            { content }
                        </td>
                    );
                })}
            </tr>);
        });

        return contentView;
    }
    renderTable = () => {
        let headerView = this._renderTableHeader();
        let contentView = this._renderContent();
        let title = this.props.title || "Data Table";
        return (
            <table className="data-inner-table" border="1" style={{width: this.width}}>
                <caption className="data-table-caption">{title}</caption>
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
        console.log("DataTable:render", this.props.data);
        
        return (
            <div className={this.props.className}>
                {this.pagination.enabled && 
                     <Pagination 
                    type = {this.props.pagination.type}
                    totalRecords={this.state.data.length}
                    pageLength = {this.state.pageLength}
                    onPageLengthChange = {this.onPageLengthChange}
                    onGotoPage = {this.onGotoPage}/>
                 }
                 {this.renderToolbar()}
                 {this.renderTable()}
            </div>
        )
    }
}