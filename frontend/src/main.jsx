import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import RegionalManagerRegistrationForm from './components/Authentication/RegionalManagerReg';
import RManagerList from './components/Pages/RManagerList';
import ChangePasswordForm from './components/Authentication/ChangePassword';
import Settings from './components/Authentication/Settings';


const Main = () => {
  

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<OTPform />} />

        {/* Private Routes */}
        
          <Route path="/home" element={<App />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
              <Route path="customer" element={<Customer />}>
              <Route path="CustomerReg" element={<CustomerRegistrationForm />} />
              <Route path="CustomerList" element={<CustomerList />} />
              </Route>
            <Route path="users" element={<Users />}>
              <Route path="Registration" element={<AddUser />}>
                <Route index element={<Navigate to="StaffReg" replace />} />
                <Route path="AdminReg" element={<AdminRegistrationForm />} />
                <Route path="StaffReg" element={<StaffRegistrationForm />} />
                <Route path="RManagerReg" element={<RegionalManagerRegistrationForm />} />
              </Route>
              <Route path="userList" element={<UsersList />}>
                <Route index element={<Navigate to="StaffList" replace />} />
                <Route path="AdminList" element={<AdminList />} />
                <Route path="StaffList" element={<StaffList />} />
                <Route path="RManagerList" element={<RManagerList />} />
              </Route>
            </Route>
            <Route path="settings" element={<Settings />}>
              <Route path="change-password" element={<ChangePasswordForm />} />
            </Route>
          </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
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
