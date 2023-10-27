

import React, { useEffect, useState } from "react";
import "./table.css";
import InputBox from "./inputBox";
import Pageination from "./pagination";
// Table component for fetching table data  
const EntryTable = () => {
  const [tableData, setTableData] = useState(
    JSON.parse(localStorage.getItem("tableData")) || []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllChecked, setSelectAllChecked] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRowId, setEditingRowId] = useState(null); // Track editing row
  const [errorFound, setErrorFound] =useState(false);
  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const jsonData = await response.json();
      setTableData(jsonData);
      // Update localStorage with  the fetched data entries
      localStorage.setItem("tableData", JSON.stringify(jsonData));
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorFound(true);
    }
  };


  useEffect(() => {
      fetchData();
  }, []);


  // Update localStorage whenever tableData changes in the table
  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);


  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );


  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);


  const handlePageChange = (newPage) => {
    setSelectAllChecked([]);
    setCurrentPage(newPage);
  };

// this function is used to check all the rows
  const CheckAllTheRows = () => {
    if (selectAllChecked.length === currentRows.length) {
      setSelectAllChecked([]);
      setSelectedRows([]);
    } else {
      const allRowIds = currentRows.map((row) => row.id);
      setSelectAllChecked(allRowIds);
      setSelectedRows(allRowIds);
    }
  };

  //All the row checks are handeled here
  const handleRowCheck = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  //To delete a single row on click on delete icon the row should get deleted 
  const deleteOneRow = (rowId) => {
    const updatedTableData = tableData.filter((row) => row.id !== rowId);
    setTableData(updatedTableData);
  };

  
  //These two functions are handeling the edit part.
  const handleEdit = (id) => {
    setEditingRowId(id);
  };

  const handleEditInputChange = (id, fieldName, value) => {
    const updatedTableData = tableData.map((row) =>
      row.id === id ? { ...row, [fieldName]: value } : row
    );
    setTableData(updatedTableData);
  };


  const handleSaveEdit = (id) => {
    setEditingRowId(null); // Finish editing

    // Find the edited row
    const editedRow = tableData.find((row) => row.id === id);

    // Update the table data with the edited row
    const updatedTableData = tableData.map((row) =>
      row.id === id ? editedRow : row
    );

    setTableData(updatedTableData);
  };

  //When we press X the edit will not be saved and previous saved will be restored
  const handleCancelEdit = (id) => {
    setEditingRowId(null); // Cancel editing
  };


  //All the selected rows will get deleted 
  const handleDeleteSelected = () => {
    const updatedTableData = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setTableData(updatedTableData);

    setSelectedRows([]);
  };



  //This function is handeling the search functionality
  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
   
  };

 if(errorFound)
    return(
      <span  className = "error-handling">No data found or Can't fetch the data at the moment</span>  
      );


  return (
    <div>
      <InputBox handleSearchQuery={handleSearch} searchQuery={searchQuery} />
      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                id="selectAll"
                name="selectAll"
                value="All"
                checked={selectAllChecked.length === currentRows.length}
                onChange={CheckAllTheRows}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id} className={selectedRows.includes(row.id) ? "selected-row" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowCheck(row.id)}
                />
              </td>
              <td>
                {editingRowId === row.id ? (
                  // Editable input field for Name
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "name", e.target.value)
                    }
                  />
                ) : (
                  // Display the name
                  row.name
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  // Editable input field for Email
                  <input
                    type="text"
                    value={row.email}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "email", e.target.value)
                    }
                  />
                ) : (
                  // Display the email
                  row.email
                )}
              </td>
              <td>
                {editingRowId === row.id ? (
                  // Editable input field for Role
                  <input
                    type="text"
                    value={row.role}
                    onChange={(e) =>
                      handleEditInputChange(row.id, "role", e.target.value)
                    }
                  />
                ) : (
                  // Display the role
                  row.role
                )}
              </td>
              <td>
                <div className="icons">
                  {editingRowId === row.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row.id)}
                        className="fa-solid fa-check"
                      >
                        {/* <i class="fa-light fa-check"></i> */}
                      </button>
                      <button
                        onClick={() => handleCancelEdit(row.id)}
                        className="fa-solid fa-window-close"
                      >
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(row.id)}>
                      <i className="fa-solid fa-pen-to-square" name="edit"></i>
                    </button>
                  )}
                  <button
                    className="fa-solid fa-trash"
                    name="delete"
                    value={row.id}
                    onClick={(e) => deleteOneRow(e.target.value)}
                  ></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pageination
        totalPages={Math.ceil(filteredData.length / rowsPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onDeleteSelected={handleDeleteSelected}
      />
      </div>
    </div>
  );
};

export default  EntryTable;
//This function is imported in App.js
