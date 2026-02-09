import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { profileView } from "../../../types/EditProfilrSchema";
import { toast } from "react-toastify";
import { apiAxios } from "../../../api/apiUrl";

interface PageProps {
  error: any;
  EditData: any;
  profileId: any;
}

const ProfileForm: React.FC<PageProps> = ({ profileId, EditData }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useForm<profileView>();

  const [loading, setLoading] = useState(false);
  const [savedAdminComments, setSavedAdminComments] = useState("");

  // ✅ Load Admin Comments when EditData changes
  useEffect(() => {
    if (EditData?.[6]?.Admin_comments) {
      console.log("Loaded Admin Comments:", EditData[6].Admin_comments);
      setSavedAdminComments(EditData[6].Admin_comments);
      setValue("profileView.Admin_comments", EditData[6].Admin_comments);
    }
  }, [EditData, setValue]);

  // ✅ Track the admin comment dynamically
  const adminComments = watch("profileView.Admin_comments", "");
  const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');

  // ✅ Function to submit admin comments only
  const onSubmitAdminComments = async () => {
    if (!adminComments.trim()) {
      toast.error("Admin comments are required.");
      return;
    }

    if (!profileId) {
      toast.error("Profile ID is missing!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Admin_comments", adminComments);
      formData.append("admin_user_id", adminUserID ?? "");

      const response = await apiAxios.put( // ✅ Use POST if the API requires FormData
        `api/update-admincomments/${profileId}/`,
        formData
      );

      // if (response.status === 200) {
      //   toast.success("Admin comments updated successfully!");
      // } else {
      //   toast.error("Failed to update comments.");
      // }
      if (response.status === 200) {
        toast.success("Admin comments updated successfully!");

        // ✅ Mark this as SAVED value
        setSavedAdminComments(adminComments);

        // ✅ Sync form with saved value
        setValue("profileView.Admin_comments", adminComments, {
          shouldDirty: false,
        });
      }
    } catch (error) {
      console.error("Error updating comments:", error);
      toast.error("Error updating comments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        {...register("profileView.Admin_comments", { required: "This field is required" })}
        placeholder="Enter admin comments..."
        className="w-full sm:w-80 md:w-96 h-40 border-2  text-[#000000e6]  border-green-500 rounded-3xl px-4 focus:outline-none focus:border-blue-700 transition duration-300"
      />
      {errors?.profileView?.Admin_comments && (
        <p className="text-red-600">{errors.profileView.Admin_comments.message}</p>
      )}

      {/* ✅ Separate Button for Admin Comments Submission */}
      <Button
        onClick={onSubmitAdminComments} // Calls only admin comment API
        name="save"
        variant="contained"
        sx={{ textTransform: "none", ml: 20 }}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Admin Comments"}
      </Button>
    </div>
  );
};

export default ProfileForm;
