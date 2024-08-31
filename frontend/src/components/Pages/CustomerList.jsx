import React, { useState, useEffect } from 'react';
import api from '../../api';
import DataTable from "../sub-components/DataTable";
import "./Users.css";
import ExcelExport from '../FileExport/ExportExcel';
import CsvExport from '../FileExport/ExportCsv';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const CustomerList = () => {
    const [rows, setRows] = useState([]);
    const [columns] = useState([
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'id_number', headerName: 'ID Number', width: 150 },
        { field: 'branch', headerName: 'Branch', width: 150 },
        { field: 'residence', headerName: 'Residence', width: 150 },
        { field: 'residence_type', headerName: 'Residence Type', width: 150 },
        { field: 'business_type', headerName: 'Business Type', width: 150 },
        { field: 'business_area', headerName: 'Business Area', width: 150 },
        { field: 'next_of_keen', headerName: 'Next of Keen', width: 150 },
        { field: 'guaranter_firstname', headerName: 'Guaranter Firstname', width: 150 },
        { field: 'guaranter_lastname', headerName: 'Guaranter Lastname', width: 150 },
        { field: 'guaranter_age', headerName: 'Guaranter Age', width: 100 },
        { field: 'guaranter_business_type', headerName: 'Guaranter Business Type', width: 150 },
        { field: 'guaranter_phone', headerName: 'Guaranter Phone', width: 150 },
        { field: 'guaranter_id', headerName: 'Guaranter ID', width: 150 },
        { field: 'guaranter_gender', headerName: 'Guaranter Gender', width: 100 },
        { field: 'staff_name', headerName: 'Staff Name', width: 150 },
        { field: 'staff_id_number', headerName: 'Staff ID Number', width: 150 },
        { field: 'staff_phone', headerName: 'Staff Phone', width: 150 },  // Add this line
        { field: 'created_at', headerName: 'Created At', width: 150 },
        { field: 'updated_at', headerName: 'Updated At', width: 150 },
    ]);

    const customerTableStyles = {
        height: '650px',
    };

    useEffect(() => {
        api.get('/customers/')
            .then(response => {
                const data = response.data.map(item => ({
                    id: item.id,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    age: item.age,
                    gender: item.gender,
                    phone: item.phone,
                    email: item.email,
                    id_number: item.id_number,
                    branch: item.branch,
                    residence: item.residence,
                    residence_type: item.residence_type,
                    business_type: item.business_type,
                    business_area: item.business_area,
                    next_of_keen: item.next_of_keen,
                    guaranter_firstname: item.guaranter_firstname,
                    guaranter_lastname: item.guaranter_lastname,
                    guaranter_age: item.guaranter_age,
                    guaranter_business_type: item.guaranter_business_type,
                    guaranter_phone: item.guaranter_phone,
                    guaranter_id: item.guaranter_id,
                    guaranter_gender: item.guaranter_gender,
                    staff_name: item.staff_name,
                    staff_id_number: item.staff_id_number,
                    staff_phone: item.staff_phone,  // Add this line
                    created_at: new Date(item.created_at).toLocaleString(),
                    updated_at: new Date(item.updated_at).toLocaleString(),
                }));
                setRows(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    return (
        <div>
            <h2>Customer List</h2>
            <div style={{ border:"solid 1px black", width:"10%", textAlign:"center"}}>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Export List">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            Export
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem>
                            <CsvExport data={rows} filename="customers-list.csv" />
                        </MenuItem>
                        <MenuItem>
                            <ExcelExport data={rows} filename="customers-list.xlsx" />
                        </MenuItem>
                    </Menu>
                </Box>
            </div>
            <DataTable rows={rows} columns={columns} loading={!rows.length} sx={customerTableStyles} />
        </div>
    );
};

export default CustomerList;
