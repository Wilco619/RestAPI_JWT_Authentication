import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = ({ rows, columns, loading, sx, pageSize, onPageSizeChange, rowsPerPageOptions }) => {
    return (
        <div style={{ height: 650, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                rowsPerPageOptions={rowsPerPageOptions}
                pagination
                sx={sx}
            />
        </div>
    );
};

export default DataTable;
