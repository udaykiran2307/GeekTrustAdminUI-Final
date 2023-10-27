
import React from 'react';
//react import  
const InputBox = ({ handleSearchQuery, searchQuery }) => { // Receive search query
    return (
        <div>
            <input
                type="text"
                placeholder='Search by name, email or role'
                style={{ width: '100vw', height: "4vh", margin: "5px" }}
                value={searchQuery} // controlling input
                onChange={handleSearchQuery} // Call the function 
            />
        </div>
    );
}

export default InputBox;