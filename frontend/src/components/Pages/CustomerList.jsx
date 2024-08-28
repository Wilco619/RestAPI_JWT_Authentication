import "./Users.css";
import { useEffect, useState } from 'react';
import api from "../../api";
import DataTable from "../sub-components/DataTable";

const CustomerList = () => {
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'username', headerName: 'Username', width: 100 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'address', headerName: 'Address', width: 100 },
        { field: 'id_number', headerName: 'ID', width: 150 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 100 },
        { field: 'updated_at', headerName: 'Updated At', width: 100 },
    ]);

    const userTableStyles = {
      height: '650px',
  };

    useEffect(() => {
        api.get('/list/customers-list/')
            .then(response => {
                const data = response.data.map(item => ({
                    id: item.id,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    email: item.email,
                    username: item.username,
                    gender: item.gender,
                    address: item.address,
                    id_number: item.id_number,
                    phone: item.phone,
                    created_at: new Date(item.created_at).toLocaleString(),
                    updated_at: new Date(item.updated_at).toLocaleString(),
                }));
                setRows(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <p>List Of Customers</p>
            <DataTable rows={rows} columns={columns} loading={!rows.length} sx={userTableStyles} />
        </div>
    );
};

export default CustomerList;
