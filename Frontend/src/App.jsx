import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/placeOrder/PlaceOrder';
// import { PlaceOrder } from "./pages/placeOrder/PlaceOrder.jsx";

// import LoginPopUp from './components/loginPopUp/LoginPopUp';
import LoginPopUp from './components/loginPopUp/LoginPopUp.jsx';
import NotFound from './pages/NotFound/NotFound';
import Verify from './pages/Verify/Verify.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx'; // ✅ import added
import MyOrder from './pages/MyOrders/MyOrder.jsx';
// import './custom-toast.css'


function App() {
  const [showLogIn, setShowLogIn] = useState(false);
  const location = useLocation();

  // ✅ Show Navbar/Footer only on these pages
  const showNavFooter = ['/', '/cart', '/order','/myorders'].includes(location.pathname);

  return (
    <>
      
      

      {showLogIn && <LoginPopUp setShowLogIn={setShowLogIn} />}

      <div className="app">
        <ScrollToTop /> {/* ✅ This ensures you always start from top */}
        {showNavFooter && <Navbar setShowLogIn={setShowLogIn} />}

        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={ <MyOrder/>} />
        </Routes>
      </div>

      {showNavFooter && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;