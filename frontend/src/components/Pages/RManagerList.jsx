import "./Users.css";
import React from 'react';
import { useEffect, useState } from 'react';
import api from "../../api";
import DataTable from "../sub-components/DataTable";
import ExcelExport from '../FileExport/ExportExcel';
import CsvExport from '../FileExport/ExportCsv';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const RManagerList = () => {
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
        api.get('/list/rmanagers-list/')
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


    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    return (
        <div>
            <p>List Of R.Managers</p>
            <div>
                <Box sx={{ flexGrow: 0 , backgroundColor: "#135D66", width:"8%", textAlign:"center", borderRadius:"5px", marginBottom:"5px"}}>
                    <Tooltip title="Export List">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 ,color:"#fff", fontSize:"1.2em", width:"100%"}}>
                            Export
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '40px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem>
                            <CsvExport data={rows} filename="rmanagers-list.csv" />
                        </MenuItem>
                        <MenuItem>
                            <ExcelExport data={rows} filename="rmanagers-list.xlsx" />
                        </MenuItem>
                    </Menu>
                </Box>
            </div>
            <div>

                <DataTable rows={rows} columns={columns} loading={!rows.length} sx={userTableStyles} />
            </div>
        </div>
    );
};
export default RManagerList;
