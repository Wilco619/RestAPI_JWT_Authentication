import React, { useState, useEffect } from 'react';
import api from '../../api';
import "./Users.css"
import DataTable from "../sub-components/DataTable";
import ExcelExport from '../FileExport/ExportExcel';
import CsvExport from '../FileExport/ExportCsv';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GridActionsCellItem } from '@mui/x-data-grid';

const CustomerList = () => {
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [pageSize, setPageSize] = useState(5); // Default page size
    const [open, setOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        fetchCustomers();
        fetchUserType();
    }, []);

    useEffect(() => {
        setColumns([
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
            { field: 'next_of_keen', headerName: 'Next of Kin', width: 150 },
            { field: 'guaranter_firstname', headerName: 'Guarantor Firstname', width: 150 },
            { field: 'guaranter_lastname', headerName: 'Guarantor Lastname', width: 150 },
            { field: 'guaranter_age', headerName: 'Guarantor Age', width: 100 },
            { field: 'guaranter_business_type', headerName: 'Guarantor Business Type', width: 150 },
            { field: 'guaranter_phone', headerName: 'Guarantor Phone', width: 150 },
            { field: 'guaranter_id', headerName: 'Guarantor ID', width: 150 },
            { field: 'guaranter_gender', headerName: 'Guarantor Gender', width: 100 },
            { field: 'created_at', headerName: 'Created At', width: 150 },
            { field: 'updated_at', headerName: 'Updated At', width: 150 },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 100,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => handleOpen(params.row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => handleDelete(params.row.id)}
                    />,
                ],
            },
        ]);
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers/');
            const data = response.data.map(item => ({
                ...item,
                created_at: new Date(item.created_at).toLocaleString(),
                updated_at: new Date(item.updated_at).toLocaleString(),
            }));
            setRows(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchUserType = async () => {
        try {
            const response = await api.get('/user/');
            setUserType(response.data.user_type);
        } catch (error) {
            console.error('Error fetching user type:', error);
        }
    };

    const handleOpen = (customer) => {
        setCurrentCustomer(customer);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCustomer(null);
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/customers/${currentCustomer.id}/`, currentCustomer);
            setRows(rows.map(row => (row.id === currentCustomer.id ? {
                ...response.data, 
                created_at: new Date(response.data.created_at).toLocaleString(), 
                updated_at: new Date(response.data.updated_at).toLocaleString()
            } : row)));
            handleClose();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}/`);
                setRows(rows.filter(row => row.id !== id));
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    return (
        <div>
            <div style={{ marginLeft: "20px" }}>
                <h2>Customer List</h2>
                <Box sx={{ flexGrow: 0 , backgroundColor: "#135D66", width:"3%", textAlign:"center", borderRadius:"5px", marginBottom:"5px"}}>
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
                        <MenuItem onClick={handleCloseUserMenu}>
                            <CsvExport data={rows} />
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ExcelExport data={rows} />
                        </MenuItem>
                    </Menu>
                </Box>
            </div>
            <div className="data-table-container">
                <DataTable
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    loading={!rows.length}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </div>
            {currentCustomer && (
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: '8px',
                        width: {
                            xs: '90%', // Full width on small screens
                            sm: '80%', // 80% width on small screens
                            md: '70%', // 70% width on medium screens
                            lg: '60%', // 60% width on large screens
                            xl: '50%'  // 50% width on extra-large screens
                        },
                        maxHeight: {
                            xs: '80%', // Limit height on small screens
                            sm: '70%', // 70% height on small screens
                            md: '60%', // 60% height on medium screens
                            lg: '50%', // 50% height on large screens
                            xl: '40%'  // 40% height on extra-large screens
                        },
                        overflowY: 'auto',
                    }}>
                        <h3>Update Customer</h3>

                        <Grid container spacing={2}>
                            {/* Column 1 */}
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    label="First Name"
                                    name="firstname"
                                    value={currentCustomer.firstname || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Last Name"
                                    name="lastname"
                                    value={currentCustomer.lastname || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Age"
                                    name="age"
                                    value={currentCustomer.age || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Gender"
                                    name="gender"
                                    value={currentCustomer.gender || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={currentCustomer.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                    disabled={userType === 2 || userType === 3}
                                />
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={currentCustomer.email || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="ID Number"
                                    name="id_number"
                                    value={currentCustomer.id_number || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                    disabled={userType === 2 || userType === 3}
                                />
                                <TextField
                                    label="Branch"
                                    name="branch"
                                    value={currentCustomer.branch || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Residence"
                                    name="residence"
                                    value={currentCustomer.residence || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Residence Type"
                                    name="residence_type"
                                    value={currentCustomer.residence_type || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>

                            {/* Column 2 */}
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    label="Business Type"
                                    name="business_type"
                                    value={currentCustomer.business_type || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Business Area"
                                    name="business_area"
                                    value={currentCustomer.business_area || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Next of Kin"
                                    name="next_of_keen"
                                    value={currentCustomer.next_of_keen || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Firstname"
                                    name="guaranter_firstname"
                                    value={currentCustomer.guaranter_firstname || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Lastname"
                                    name="guaranter_lastname"
                                    value={currentCustomer.guaranter_lastname || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Age"
                                    name="guaranter_age"
                                    value={currentCustomer.guaranter_age || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Business Type"
                                    name="guaranter_business_type"
                                    value={currentCustomer.guaranter_business_type || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Phone"
                                    name="guaranter_phone"
                                    value={currentCustomer.guaranter_phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor ID"
                                    name="guaranter_id"
                                    value={currentCustomer.guaranter_id || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                                <TextField
                                    label="Guarantor Gender"
                                    name="guaranter_gender"
                                    value={currentCustomer.guaranter_gender || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Box mt={4} display="flex" justifyContent="flex-end">
                            <Button onClick={handleUpdate} variant="contained" color="primary">
                                Update
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default CustomerList;
