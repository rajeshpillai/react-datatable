import React from 'react';
import ReactDOM from 'react-dom';
import "./pagination.css";

export default  class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.currentPage = 1;
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
        this.currentPage = pageNo;
        this.props.onGotoPage(e, pageNo);      
    }

    render() {
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
        for(let i = 1; i <= pages; i++) {
            buttons.push(this._getPaginationButtons(i));
        }

        let nextButton = (
            <button key="next" className="pagination-btn prev"
                onClick={(e)=> {this.onNextPage(e)}}
                type="button">
                next
            </button>
        );
        
        return (
            <div className="pagination">
                {[prevButton, ...buttons, nextButton]}
            </div>
        );
    }
}