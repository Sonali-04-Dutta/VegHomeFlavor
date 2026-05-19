import React from 'react'
import Navbar from "./components/Navbar/Navbar";   // ✅ import Navbar
import Sidebar from "./components/Sidebar/Sidebar"; // ✅ import Sidebar
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'

const App = () => {

  const url = "http://localhost:4000";
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <main className="admin-main">
          <Routes>
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
