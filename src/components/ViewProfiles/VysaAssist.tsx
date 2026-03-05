import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Link,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../../api/apiUrl';
import VysAssistPopup from '../VysAssistPopup';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface VysAssistRecord {
  vysassist_id: number;
  profile_from: string;
  from_name: string;
  from_mobile: string;
  profile_to: string;
  to_name: string;
  to_mobile: string;
  message: string;
  req_datetime: string | null;
  response_datetime: string | null;
  status: number | string;
}

const VysAssist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProfileFromUrl = searchParams.get('profileId') || '';

  const [data, setData] = useState<VysAssistRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialProfileFromUrl);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVysAssistData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const queryTerm = search.trim();
        const url = queryTerm
          ? `${apiUrl.apiUrlConfig}api/admin/vysassist/?profile_from=${queryTerm}`
          : `${apiUrl.apiUrlConfig}api/admin/vysassist/`;

        console.log("Fetching VysAssist Data from:", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response payload:", result);

        if (result.status === 1 && result.data) {
          setData(result.data);
        } else {
          setData([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch VysAssist data:', error);
        setErrorMsg(error.message || "Unknown error occurred");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchVysAssistData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const columns: Column[] = [
    { id: 'vysassist_id', label: 'Vysassist Id', align: 'center' },
    { id: 'profile_from', label: 'From Profile ID', align: 'center' },
    { id: 'from_name', label: 'From Name' },
    { id: 'from_mobile', label: 'From Mobile' },
    { id: 'profile_to', label: 'To Profile ID' },
    { id: 'to_name', label: 'To Name' },
    { id: 'to_mobile', label: 'To Mobile' },
    { id: 'message', label: 'Message' },
    { id: 'req_datetime', label: 'Request Date' },
    { id: 'response_datetime', label: 'Response Date' },
    { id: 'status', label: 'Status' },
  ];

  const filteredData = data;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Vys Assist</h1>

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : errorMsg ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ color: 'red' }}>
                    Error loading data: {errorMsg}
                  </TableCell>
                </TableRow>
              ) : filteredData && filteredData.length > 0 ? (
                filteredData
                  .map((row, index) => (
                    <TableRow hover key={index}>
                      <TableCell>
                        <Link
                          component="button"
                          onClick={() => setSelectedId(row.vysassist_id.toString())}
                          sx={{ color: 'blue', cursor: 'pointer' }}
                        >
                          {row.vysassist_id}
                        </Link>
                      </TableCell>

                      <TableCell
                        onClick={() => navigate(`/viewProfile?profileId=${row.profile_from}`)}
                        sx={{ color: 'blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      >
                        {row.profile_from}
                      </TableCell>

                      <TableCell>{row.from_name}</TableCell>
                      <TableCell>{row.from_mobile}</TableCell>

                      <TableCell
                        onClick={() => navigate(`/viewProfile?profileId=${row.profile_to}`)}
                        sx={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {row.profile_to}
                      </TableCell>

                      <TableCell>{row.to_name || 'N/A'}</TableCell>
                      <TableCell>{row.to_mobile || 'N/A'}</TableCell>
                      <TableCell>{row.message || 'N/A'}</TableCell>

                      <TableCell>{row.req_datetime ? row.req_datetime.split('T')[0] : 'N/A'}</TableCell>
                      <TableCell>{row.response_datetime ? row.response_datetime.split('T')[0] : 'N/A'}</TableCell>
                      <TableCell>{row.status === 1 ? 'Completed' : 'Pending'}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Popup Logic */}
      {selectedId && (
        <VysAssistPopup vysassistId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default VysAssist;
