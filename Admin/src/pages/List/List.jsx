import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const List = ({url}) => {
 
  const [list, setList] = useState([]);

  // ✅ Fetch all food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        toast.success("List fetched successfully!");
      } else {
        toast.error("Error fetching data!");
      }
    } catch (error) {
      toast.error("Server error!");
      console.error(error);
    }
  };

  // ✅ Delete item
  const removeFood = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        // remove the deleted item from UI
        setList(prevList => prevList.filter(item => item._id !== id));
        toast.success("Item removed successfully!");
      } else {
        toast.error("Error removing item!");
      }
    } catch (error) {
      toast.error("Server error while removing!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list text-col'>
      <ToastContainer position="top-right" autoClose={2000} />
      <p className='list-title'>All Foods List</p>

      <div className="list-table">
        <div className="list-table-header">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-row">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              {/* ✅ Indian Rupee format */}
              <p>₹{item.price}</p>
              <button className="delete-btn" onClick={() => removeFood(item._id)}>✖</button>
            </div>
          ))
        ) : (
          <p className='no-items'>No items found</p>
        )}
      </div>
    </div>
  );
};

export default List;
