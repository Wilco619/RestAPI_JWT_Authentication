import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleIcon from '@mui/icons-material/People';
import { FaBalanceScale } from "react-icons/fa";

export const FirstRowDivContent = [
  {
    id: 1,
    text: "Customers",
    Number: 0,
  },
  {
    id: 2,
    text: "Active-Loans",
    Number: 33450000,
  },
  {
    id: 3,
    text: "Total-Borrowed",
    Number: 6000000,
  },
  {
    id: 4,
    text: "Total-Deposited",
    Number: 6783700,
  },
]

export const NavText = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardOutlinedIcon />,
    sublinks: [
      { id: 1, name: "Dashboard", link: "/home/dashboard" },  // Add the link property
      { id: 2, name: "D-Items", link: "/home/dashboard/items" }, // Add the link property
    ],
  },
  {
    id: 2,
    name: "Customer",
    icon: <PeopleIcon/>,
    sublinks: [
      { id: 1, name: "Customer Registration", link: "/home/customer/CustomerReg" },  // Add the link property
      { id: 2, name: "Customer List", link: "/home/customer/CustomerList" },  // Add the link property
      { id: 3, name: "Customer Details", link: "/home/customer/CustomerData" },  // Add the link property
      
    ],
  },
  {
    id: 3,
    name: "Users",
    icon: <PeopleIcon/>,
    sublinks: [
      { id: 1, name: "User Registration", link: "/home/users/Registration" },  // Add the link property
      { id: 2, name: "Users List", link: "/home/users/UserList" },  // Add the link property
      { id: 3, name: "user details", link: "/home/users/UserList" },  // Add the link property
      
    ],
  },
  {
    id: 4,
    name: "Loans",
    icon: <FaBalanceScale size={22}/>,
    sublinks: [
      { id: 1, name: "Loan Status", link: "/home/loans/status" },  // Add the link property
      { id: 2, name: "New Loans", link: "/home/loans/new" },  // Add the link property
      { id: 3, name: "Paid", link: "/home/loans/paid" },  // Add the link property
    ],
  },
];

