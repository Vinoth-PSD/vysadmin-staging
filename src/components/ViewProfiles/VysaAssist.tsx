import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Link, Button, Typography,
  CircularProgress,
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

interface ApiResponse {
  status: number;
  count: number;
  data: VysAssistRecord[];
}

const VysAssist: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProfileFromUrl = searchParams.get('profileId') || '';

  const [data, setData] = useState<VysAssistRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialProfileFromUrl);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(50);
  const [goToPageInput, setGoToPageInput] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVysAssistData = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const queryTerm = search.trim();
        const url = new URL(`${apiUrl.apiUrlConfig}api/admin/vysassist/`);
        
        if (queryTerm) {
          url.searchParams.append('profile_from', queryTerm);
        }
        url.searchParams.append('page', (page + 1).toString());
        url.searchParams.append('page_size', rowsPerPage.toString());

        console.log("Fetching VysAssist Data from:", url.toString());
        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();
        console.log("API Response payload:", result);

        if (result.status === 1 && result.data) {
          setData(result.data);
          setTotalCount(result.count || 0);
        } else {
          setData([]);
          setTotalCount(0);
        }
      } catch (error: any) {
        console.error('Failed to fetch VysAssist data:', error);
        setErrorMsg(error.message || "Unknown error occurred");
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchVysAssistData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, page, rowsPerPage]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); 
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageInput, 10);
    if (!isNaN(pageNumber)) {
      const totalPages = Math.ceil(totalCount / rowsPerPage);
      const newPage = Math.max(0, Math.min(pageNumber - 1, totalPages - 1));
      setPage(newPage);
      setGoToPageInput('');
    }
  };

  // Custom pagination component
  const renderCustomPagination = () => {
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    const currentPage = page + 1;

    if (totalPages === 0) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-white border-t border-gray-200">
        {/* Showing X to Y of Z records */}
        <div className="text-sm text-gray-600">
          Showing <strong>{page * rowsPerPage + 1}</strong> to{' '}
          <strong>{Math.min((page + 1) * rowsPerPage, totalCount)}</strong> of{' '}
          <strong>{totalCount}</strong> records
        </div>

        <div className="flex items-center gap-3">
          {/* Go to Page Input */}
          <div className="flex items-center gap-2 pr-4 border-gray-300">
            <Typography variant="body2">Go to Page:</Typography>
            <TextField
              size="small"
              type="number"
              value={goToPageInput}
              onChange={(e) => setGoToPageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleGoToPage();
              }}
              style={{ width: '70px' }}
              inputProps={{ min: 1, max: totalPages }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleGoToPage}
              disabled={!goToPageInput}
            >
              Go
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(0)}
              disabled={page === 0}
              sx={{ minWidth: '40px' }}
            >
              {'<<'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Prev
            </Button>

            {/* Dynamic Page Numbers */}
            {(() => {
              const btns = [];
              const start = Math.max(1, currentPage - 1);
              const end = Math.min(totalPages, currentPage + 1);

              for (let i = start; i <= end; i++) {
                btns.push(
                  <Button
                    key={i}
                    variant={currentPage === i ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setPage(i - 1)}
                    sx={{ minWidth: '35px' }}
                  >
                    {i}
                  </Button>
                );
              }
              return btns;
            })()}

            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              sx={{ minWidth: '40px' }}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">
        Vys Assist <span className="text-lg font-normal">({totalCount})</span>
      </h1>

      <div className="w-full p-2">
        <TextField
          label="Search by Profile ID"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          placeholder="Enter Profile ID..."
        />
      </div>

      <Paper className="w-full">
        <TableContainer sx={{ border: '1px solid #E0E0E0' }} className="bg-white">
          <Table stickyHeader>
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

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : errorMsg ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ color: 'red' }}>
                    Error loading data: {errorMsg}
                  </TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (
                data.map((row, index) => (
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

        {renderCustomPagination()}
      </Paper>

      {selectedId && (
        <VysAssistPopup vysassistId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default VysAssist;