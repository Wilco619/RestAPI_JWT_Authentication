import { NavLink, Outlet, Navigate, useLocation} from "react-router-dom";
import "./Users.css";
import CustomerList from "./CustomerList";

const UsersList = () => {
  const location = useLocation();
    
   // If the current path is /home/users/userList, redirect to /home/users/userList/AdminList
  if (location.pathname === '/home/users/userList') {
    return <Navigate to="/home/users/userList/StaffList" />;
  }

    return (
      <div>
      <div className='regbtncontainer'>
        <NavLink 
          className={({ isActive }) => isActive ? 'btn active' : 'btn'}
          to="/home/users/userList/StaffList"
        >
          Staff List
        </NavLink>
        <NavLink
          to="/home/users/userList/RManagerList"
          className={({ isActive }) => (isActive ? 'btn active' : 'btn')}
        >
          R Manager List
        </NavLink>
        <NavLink
          to="/home/users/userList/AdminList"
          className={({ isActive }) => (isActive ? 'btn active' : 'btn')}
        >
          Admin List
        </NavLink>
      </div>
      <Outlet/>
    </div>
        
    );
};

export default UsersList;
