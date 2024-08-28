import "./App2.css"
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import MiniDrawer from "./MainPage";

const App = () => {

  return (
  <div>
    <MiniDrawer/>
    <ToastContainer />
  </div>
  );
};

export default App;
