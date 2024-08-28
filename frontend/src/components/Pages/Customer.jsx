import 'react-toastify/dist/ReactToastify.css';
import "./Users.css"
import { Outlet } from 'react-router-dom';
import React from 'react'

const Customer = () => {
  return (
    <div>
      <Outlet/>  
    </div>
  )
}

export default Customer
