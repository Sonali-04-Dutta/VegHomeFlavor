import { createContext, useState, useEffect } from "react";
import { menu_list } from "../../assets/assets";
import axios from "axios";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000/";
  // const [token, setToken] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const[food_list,setFoodList]=useState([])

// const url = "http://localhost:4000/";


    
 // ✅ Whenever token changes, update localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }

    async function loadData() {
      await fetchFoodList();
       if (token) {
         localStorage.setItem("token", token);
         await loadCartData(localStorage.getItem("token"));
    }
    }
    loadData();
  }, [token]);

  const loadCartData = async (token) => {
    const response = await axios.post(url + "api/cart/get", {}, { headers: { token } })
    setCartItems(response.data.cartData);
  }


  // 🧩adding food_list items from backend
  const fetchFoodList = async () => {
    const response = await axios.get(url + "api/food/list");
    setFoodList(response.data.data);
  }

  // ➕ Add to cart
  const addToCart = async (itemId) => {
    setCartItems((prev = {}) => ({
  ...prev,
  [itemId]: (prev[itemId] || 0) + 1,
}));
    if (token) {
      await axios.post(url + "api/cart/add",{itemId},{headers:{token}})
    }
  };

  // ➖ Remove from cart
  const removeFromCart = async (itemId) => {
   setCartItems((prev = {}) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId]; // ✅ সম্পূর্ণভাবে রিমুভ করে দিচ্ছে
      }
      return updatedCart;
    });
    // save the data after removing cart items and update it in mongodb
    if (token) {
      await axios.post(url + "api/cart/remove",{itemId},{headers:{token}})
    }
  };

  // 🧾 Debug: দেখবে কার্টে কী আছে
  useEffect(() => {
    console.log("🛒 Cart Updated:", cartItems);
  }, [cartItems]);

  // ✅ Context Values
  const contextValue = {
    food_list,
    setFoodList,
    menu_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
