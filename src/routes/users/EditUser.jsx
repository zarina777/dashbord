import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../api/api";

// Fetch user data with react-query
const fetchUserData = async (id) => {
  const res = await api.get(`users/${id}`);
  return res.data;
};

// Update user data with react-query
const updateUserData = async (id, data) => {
  const res = await api.put(`users/${id}`, data);
  return res.data;
};

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Use react-query to fetch user data
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["user", id], // Key for caching and identification
    queryFn: () => fetchUserData(id), // Function to fetch

    onError: (error) => {
      console.error(error);
      toast.error("Error fetching user data.");
    },
    enabled: !!id, // Only run the query if the id is available
  });

  useEffect(() => {
    if (data) {
      setValue("username", data?.username);
      setValue("type", data?.type);
    }
  }, [data, setValue]);

  // Use react-query to handle user update
  const mutation = useMutation({
    mutationFn: (data) => updateUserData(id, data),
    onSuccess: () => {
      toast.success("Successfully updated user", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate("/users"), 1500);
    },
    onError: (error) => {
      toast.error("Error updating user. Please try again.", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error(error);
    },
  });

  // Handle form submit
  const onSubmit = async (formData) => {
    if (formData.password.trim() === "") {
      delete formData.password; // Remove empty password
    }
    mutation.mutate(formData); // Trigger mutation to update user data
  };

  // Show error if fetching user data failed
  if (isError) {
    return (
      <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
        <ToastContainer />
        <h1 className="text-white text-[40px] font-extrabold">Error</h1>
        <p className="text-red-500">Error fetching user data.</p>
        <Link to="/users" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg">
          <MdArrowBack /> <span>Back</span>
        </Link>
      </div>
    );
  }

  // Loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
        <ToastContainer />
        <h1 className="text-white text-[40px] font-extrabold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
      <ToastContainer />
      <h1 className="text-white text-[40px] font-extrabold">Edit a User</h1>

      {/* Form for updating user */}
      <form className="flex flex-col gap-4 p-14 justify-around bg-white w-full rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl">Username of user</label>
        <input
          className={`p-3 border ${errors.username ? "border-red-500" : ""}`}
          type="text"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 5,
              message: "Username must be at least 5 characters long",
            },
          })}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <label className="text-2xl">Change password (Optional)</label>
        <input
          className={`p-3 border ${errors.password ? "border-red-500" : ""}`}
          type="text"
          {...register("password", {
            required: false,
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <label className="text-2xl">Type of user</label>
        <select className={`p-3 border text-xl ${errors.type ? "border-red-500" : ""}`} {...register("type", { required: "User type is required" })}>
          <option className="text-xl" value="user">
            user
          </option>
          <option className="text-xl" value="admin">
            admin
          </option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}

        <button
          className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]"
          type="submit"
          disabled={mutation.isLoading} // Disable the button while loading
        >
          {mutation.isLoading ? "Updating..." : "Submit"}
        </button>
      </form>

      <Link to="/users" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg">
        <MdArrowBack /> <span>Back</span>
      </Link>
    </div>
  );
};

export default EditUser;
