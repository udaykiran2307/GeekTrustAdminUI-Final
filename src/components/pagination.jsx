
// Pagination.js
import React from "react";
import "./pagination.css"

//The component Pagination controls DeleteAll and pagination. 

const Pageination = ({ totalPages, currentPage, onPageChange, onDeleteSelected }) => {
  const handleClickOnPage = (newPage) => {
    onPageChange(newPage);
  };


  return (
    <div className="pageination">
      <button className="deleteButton" onClick={onDeleteSelected}>
        Delete Selected
      </button>
      <ul className="circle-button">
        <li>
          <button onClick={() => handleClickOnPage(1)} disabled={currentPage === 1}>
            <i className="fa-solid fa-angles-left fa-xl"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handleClickOnPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
        </li>
        {Array.from({ length: totalPages }, (v, i) => (
          <li key={i}>
            <button
              onClick={() => handleClickOnPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          </li>
        ))}
        <li>
          <button onClick={() => handleClickOnPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-angle-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
        <li>
          <button onClick={() => handleClickOnPage(totalPages)} disabled={currentPage === totalPages}>
            <i className="fa-solid fa-angles-left fa-rotate-180 fa-xl"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};


export default Pageination;

