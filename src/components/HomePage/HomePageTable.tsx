import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button, IconButton, Paper, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiAxios } from '../../api/apiUrl';

interface HomepageData {
  id: number;
  why_vysyamala: string;
  youtube_links: string;
  vysyamala_apps: string;
}

const HomepageTable: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch API data
  const fetchData = async () => {
    try {
      const response = await apiAxios.get('api/homepage-list/');
      setHomepageData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Edit
  const handleEdit = (id: number) => {
    navigate(`/EditHomepageForm/${id}`);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirmation = (id: number) => {
    setSelectedId(id);
    setOpenDeleteDialog(true); // Open confirmation dialog
  };

  // Handle Delete
  const handleDelete = async () => {
    if (selectedId !== null) {
      try {
        await apiAxios.delete(`api/homepage/delete/${selectedId}/`);
        
        // Remove deleted item from the state
        setHomepageData(homepageData.filter((item) => item.id !== selectedId));
        setOpenDeleteDialog(false); // Close dialog after successful deletion

        // Show success message using react-toastify
        toast.success("Deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error('Error deleting data:', error);
        // Show error toast if deletion fails
        toast.error("Failed to delete!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  };

  // Handle Add
  const handleAdd = () => {
    navigate("/AddHomepageForm");
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        style={{ float: 'right', margin: '20px' }}
        onClick={handleAdd}
      >
        Add
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* <TableCell>Why Vysyamala</TableCell> */}
             
              <TableCell>YouTube Link</TableCell>
              <TableCell>vysyamala Apps</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {homepageData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                {/* <TableCell dangerouslySetInnerHTML={{ __html: row.why_vysyamala }} /> */}
               
                <TableCell>
                  <a 
                    href={row.youtube_links} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                    YouTube Link
                  </a>
                </TableCell>
                <TableCell>{row.vysyamala_apps}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(row.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteConfirmation(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entry? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
};



export default HomepageTable;
