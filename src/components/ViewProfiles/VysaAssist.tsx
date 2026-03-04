import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TextField, Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VysAssistPopup from '../VysAssistPopup';

// 1. Structure Definitions
interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

// 2. Mock Data for UI Testing
const MOCK_DATA = [
  {
    profile_vysasst_id: "VYS001",
    profile_from_id: "USR101",
    profile_from_name: "Ahmed Al Harthy",
    profile_from_mobile: "9681234567",
    profile_to_id: "USR202",
    profile_to_name: "Khalid Al Habsi",
    profile_to_mobile: "9687654321",
    to_message: "Interested in partnership",
    req_datetime: "2023-10-01T10:00:00",
    response_datetime: "2023-10-02T14:00:00",
    status: "Completed"
  }
];

const VysAssist: React.FC = () => {
  // 3. State Management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const columns: Column[] = [
    { id: 'profile_vysasst_id', label: 'Vysassist Id', align: 'center' },
    { id: 'profile_from_id', label: 'From Profile ID', align: 'center' },
    { id: 'profile_from_name', label: 'From Name' },
    { id: 'profile_from_mobile', label: 'From Mobile' },
    { id: 'profile_to_id', label: 'To Profile ID' },
    { id: 'profile_to_name', label: 'To Name' },
    { id: 'profile_to_mobile', label: 'To Mobile' },
    { id: 'to_message', label: 'Message' },
    { id: 'req_datetime', label: 'Request Date' },
    { id: 'response_datetime', label: 'Response Date' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Vys Assist</h1>
      
      {/* Search Bar */}
      <div className="w-full p-2">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Paper className="w-full">
        <TableContainer sx={{ border: '1px solid #E0E0E0' }} className="bg-white">
          <Table stickyHeader>
            {/* Header Structure */}
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell 
                    key={col.id} 
                    align={col.align} 
                    sx={{ background: '#FFF9C9', color: '#DC2635', fontWeight: 600 }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Body Structure */}
            <TableBody>
              {MOCK_DATA
                .filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell>
                      <Link 
                        component="button" 
                        onClick={() => setSelectedId(row.profile_vysasst_id)}
                        sx={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {row.profile_vysasst_id}
                      </Link>
                    </TableCell>
                    
                    <TableCell 
                      onClick={() => navigate(`/viewProfile?profileId=${row.profile_from_id}`)}
                      sx={{ color: 'blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {row.profile_from_id}
                    </TableCell>

                    <TableCell>{row.profile_from_name}</TableCell>
                    <TableCell>{row.profile_from_mobile}</TableCell>
                    
                    <TableCell 
                      onClick={() => navigate(`/viewProfile?profileId=${row.profile_to_id}`)}
                      sx={{ color: 'blue', cursor: 'pointer' }}
                    >
                      {row.profile_to_id}
                    </TableCell>

                    <TableCell>{row.profile_to_name}</TableCell>
                    <TableCell>{row.profile_to_mobile}</TableCell>
                    <TableCell>{row.to_message}</TableCell>
                    
                    <TableCell>{row.req_datetime.split('T')[0]}</TableCell>
                    <TableCell>{row.response_datetime.split('T')[0]}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Structure */}
        <TablePagination
          component="div"
          count={MOCK_DATA.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      {/* Popup Logic */}
      {selectedId && (
        <VysAssistPopup vysassistId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default VysAssist;