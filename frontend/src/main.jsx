import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './components/App';
import './index.css';
import Login from './components/Authentication/Login';
import Users from './components/Pages/Users';
import Dashboard from './components/Pages/Dashboard';
import ErrorPage from './components/ErrorPage';
import OTPform from './components/Authentication/OTPform';
import AdminRegistrationForm from './components/Authentication/AdminReg';
import CustomerRegistrationForm from './components/Authentication/CustomerReg';
import AddUser from './components/Pages/AddUser';
import StaffRegistrationForm from './components/Authentication/StaffReg';
import UsersList from './components/Pages/UsersList';
import AdminList from './components/Pages/AdminList';
import StaffList from './components/Pages/StaffList';
import CustomerList from './components/Pages/CustomerList';
import Customer from './components/Pages/Customer';
import CustomerDataForm from './components/Authentication/CustomerData';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/verify-otp",
    element: <OTPform />,
  },
  {
    path: "/home",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Navigate to="dashboard" />, // Redirect /home to /home/dashboard
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "customer",
        element: <Customer />,
        children: [
          {
            path: "CustomerReg",
            element: <CustomerRegistrationForm />,
          },
          {
            path: "CustomerList",
            element: <CustomerList />,
          },      
          {
            path: "CustomerData",
            element: <CustomerDataForm />,
          },      
        ],
      },
      {
        path: "users",
        element: <Users />,
        children: [
          {
            path: "Registration",
            element: <AddUser />,
            children: [
              {
                path: "",
                element: <Navigate to="StaffReg" replace />, 
              },
              {
                path: "AdminReg",
                element: <AdminRegistrationForm />,
              },
              {
                path: "StaffReg",
                element: <StaffRegistrationForm />,
              },
            ],
          },
          {
            path: "userList",
            element: <UsersList />,
            children: [
              {
                path: "",
                element: <Navigate to="StaffList" replace />, // Redirect /home/users/userList to /home/users/userList/AdminList
              },
              {
                path: "AdminList",
                element: <AdminList />,
              },
              {
                path: "StaffList",
                element: <StaffList />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);


const Main = () => {
  return <RouterProvider router={router} />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
