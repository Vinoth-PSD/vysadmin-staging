import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { homePageApi, homePageImgUpload } from '../../services/api';

// Define the validation schema with Zod
const schema = z.object({
  why_vysyamala: z.string().min(1, "This field is required"),
  image: z.instanceof(FileList).optional(), // Optional since the field might not always be filled
  youtube_links: z.string().min(1, "This field is required"),
  vysyamala_apps: z.string().min(1, "This field is required"),
});

interface FormData {
  why_vysyamala: string;
  image: FileList | null;
  youtube_links: string;
  vysyamala_apps: string;
}

const AddHomepageForm: React.FC = () => {
  const { control, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  
  // CKEditor state
  const [editorData, setEditorData] = useState<string>('');

  // Handle CKEditor content changes and update React Hook Form state
  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    setValue('why_vysyamala', data);  // Update the form value when CKEditor content changes
  };

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data); // Debugging: Check what data is being passed

    const formData = new FormData();
    formData.append('why_vysyamala', data.why_vysyamala);  // Now CKEditor content is synced with form
    formData.append('youtube_links', data.youtube_links);
    formData.append('vysyamala_apps', data.vysyamala_apps);

    // Check if an image file is selected
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]); // Append the image file
    } else {
      console.log('No image selected'); // Debugging: See if image is being handled correctly
    }

    try {
      // Send form data via POST request to the server
      const response = await axios.post(`${homePageApi}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Successfully added new entry:', response.data);

      // Reset the form after successful submission
      reset();
      setEditorData('');  // Clear CKEditor content

      // Navigate to HomePageTable after submission
      navigate("/HomePageTable");
    } catch (error) {
      console.error('Error adding new entry:', error); // Debugging: Log any errors
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', maxWidth: 1500, mx: 'auto', mt: 4 }}
    >
      <Typography  variant="h6" gutterBottom>
        Add New Homepage Data
      </Typography>

      {/* Why Vysyamala (CKEditor) */}
      <div className="mb-4">
        <div className="custom-editor-container">
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={handleEditorChange}
            config={{
              toolbar: [
                'heading', '|',
                'alignment', '|',
                'bold', 'italic', 'underline', 'link', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'bulletedList', 'numberedList', 'blockQuote', 'selectAll', '|',
                'fontSize','|',
                'undo', 'redo', '|',
                'alignLeft', 'alignCenter', 'alignRight',
                'strikethrough', '|',
                'imageUpload', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells','|',
                'mediaEmbed','|',
                'timestamp','|',
                'findAndReplace', 'sourceEditing'
              ],
              heading: {
                options: [
                  { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
                  { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                  { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                  { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                  { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                  { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                  { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                ]
              },
              ckfinder: {
                uploadUrl: `${homePageImgUpload}` // Update this URL as needed
              },
            }}
          />
          {errors.why_vysyamala && <p className="text-red-500 text-sm">{errors.why_vysyamala.message}</p>}
        </div>
      </div>

      {/* YouTube Links */}
      <Controller
        name="youtube_links"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            label="YouTube Links"
            variant="outlined"
            error={!!errors.youtube_links} // Highlight error state
            helperText={errors.youtube_links?.message} // Display error message
          />
        )}
      />

      {/* Vysyamala Apps */}
      <Controller
        name="vysyamala_apps"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            margin="normal"
            label="Vysyamala Apps"
            variant="outlined"
            error={!!errors.vysyamala_apps} // Highlight error state
            helperText={errors.vysyamala_apps?.message} // Display error message
          />
        )}
      />

      {/* Image Upload */}
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <TextField
            type="file"
            {...field}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/*" }}
            error={!!errors.image} // Handle error state
            helperText={errors.image ? 'Please upload a valid image file' : ''} // Error message
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddHomepageForm;
