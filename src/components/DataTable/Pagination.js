import React from 'react';
import ReactDOM from 'react-dom';
import "./pagination.css";

export default  class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.pageLength = props.pageLength;
    }

    _getPaginationButtons =  (text) => {
        let classNames = 'pagination-btn';
        if (this.currentPage == text) {
            classNames += ' current-page';
        }
        let html = ( 
            <button key={`btn-${text}`} id={`btn-${text}`}
                className={classNames}
                type="button"
                onClick={(e)=> {this.onGotoPage(e, text)}}
            >{text}
            </button>
        );

        return html;
    }

    onPrevPage = (e) => {
        if (this.currentPage == 1) return;
        this.currentPage = this.currentPage - 1;
        this.onGotoPage(e, this.currentPage);
    }

    onNextPage = (e) => {
        if (this.currentPage > this.pages - 1) return;
        this.currentPage = this.currentPage + 1;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.onGotoPage(e, this.currentPage);
    }

    onGotoPage = (e, pageNo) => {
        console.log("pageno: ", pageNo);
        this.currentPageInput.value = pageNo
        this.currentPage = pageNo;
        this.props.onGotoPage(e, pageNo);      
    }

    onPageLengthChange = (e) => {
        //this.forceUpdate();
        this.props.onPageLengthChange(this.pageLength.value);
    }

    onCurrentPageChange = (e) => {
        this.currentPage = this.currentPageInput.value;
        this.props.onGotoPage(e, this.currentPageInput.value);      
    }

    render() {
        console.log("Pagination:render", this.props.pageLength);
        
        let totalRecords = this.props.totalRecords;
        let pages = Math.ceil(totalRecords / this.props.pageLength);
        this.pages = pages;
        console.log("pg: ",totalRecords, pages);

        let prevButton = (
            <button key="prev" className="pagination-btn prev"
                onClick={(e)=> {this.onPrevPage(e)}}
                type="button">
                prev
            </button>
        );

        let buttons = [];
        if (this.props.type === "long") {
            for(let i = 1; i <= pages; i++) {
                buttons.push(this._getPaginationButtons(i));
            }
        } else if (this.props.type === "short") {
            buttons.push(
                <input 
                    key="currentPageInput"
                    className="current-page-input"
                    type="number" 
                    max={this.pages}
                    onChange={(e)=>{this.onCurrentPageChange()}}
                    defaultValue = {this.currentPage}
                    ref={(currentPageInput)=> { this.currentPageInput=currentPageInput}} />
            );
        }   

        let nextButton = (
            <button key="next" className="pagination-btn prev"
                onClick={(e)=> {this.onNextPage(e)}}
                type="button">
                next
            </button>
        );

        let pageSelector = (
            <React.Fragment key="s100">
                <span key="page-selector" className="page-selector">Rows per page: 
                    <input key="ps-no" 
                        defaultValue={this.props.pageLength || 5}
                        type="number"
                        ref={(pageLength)=>this.pageLength=pageLength}
                        onChange={(e)=>{this.onPageLengthChange()}}  />
                </span>
            </React.Fragment>
        );
        
        return (
            <div className="pagination">
                {[pageSelector, prevButton, ...buttons, nextButton]}
            </div>
        );
    }
}