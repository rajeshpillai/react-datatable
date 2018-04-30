import React from 'react';
import ReactDOM from 'react-dom';
import "./pagination.css";

export default  class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: props.currentPage || 1,
            pageLength: props.pageLength,
        };
    }

    _getPaginationButtons =  (text) => {
        let classNames = 'pagination-btn';
        if (this.state.currentPage == text) {
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
        if (this.state.currentPage == 1) return;
        this.onGotoPage(e, this.state.currentPage-1);
    }

    onNextPage = (e) => {
        if (this.state.currentPage > this.pages - 1) return;
        let currentPageBtn = document.getElementById(`btn-${this.currentPage}`);
        this.onGotoPage(e, this.state.currentPage + 1);
    }

    onGotoPage = (e, pageNo) => {
        console.log("pageno: ", pageNo);
        if (pageNo === this.state.currentPage) {
            return;
        }
        if (this.currentPageInput) {
            this.currentPageInput.value = pageNo
        }
        this.setState({
            currentPage: pageNo
        });
        this.props.onGotoPage(e, pageNo);
    }

    onPageLengthChange = (e) => {
        //this.forceUpdate();
        this.props.onPageLengthChange(this.pageLength.value);
    }

    onCurrentPageChange = (e) => {
        if (this.currentPageInput.value >= this.pages) {
            this.currentPageInput.value = this.pages;
        }
        this.setState({
            currentPage: this.currentPageInput.value
        })

        this.props.onGotoPage(e, this.currentPageInput.value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("nextProps,prevState-> ", nextProps, prevState);
        if (nextProps.currentPage != prevState.currentPage) {
            return {
                currentPage: nextProps.currentPage
            }
        }
        return null;
    }

    render() {
        let totalRecords = this.props.totalRecords;
        let pages = Math.ceil(totalRecords / this.props.pageLength);
        this.pages = pages;

        let prevButton = (
            <button key="prev" className="pagination-btn prev"
                onClick={(e)=> {this.onPrevPage(e)}}
                type="button">
                {"<"}
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
                {">"}
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
