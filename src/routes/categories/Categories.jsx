import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import api from "../../api/api"; // Assuming you have a custom API setup
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch categories data
const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Delete category API call
const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data; // Return the response data (ensure successful response)
};

const Categories = () => {
  const queryClient = useQueryClient();

  // Use useQuery hook to fetch categories
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"], // Key to uniquely identify the query
    queryFn: fetchCategories, // Function to fetch categories
  });

  // Use useMutation hook for deleting category
  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi, // The mutation function
    onSuccess: () => {
      // Show success toast
      toast.success("Category successfully deleted!", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Invalidate the query to refetch the categories after a successful delete
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Error state
  if (isError) {
    return <div className="text-red-500 text-center">Error loading categories: {error.message}</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex justify-end items-start">
        <Link to="create" className="bg-blue-600 text-white rounded-md px-3 py-2 mt-10">
          Create new category
        </Link>
      </div>
      <h2 className="text-white text-3xl text-center font-extrabold mb-7 ">Categories</h2>
      <table className="min-w-full border-collapse border border-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr className="bg-[#1ccaff]">
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">No_</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Category Name</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Control</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="p-10">
                <div className="loader m-auto"></div>
              </td>
            </tr>
          )}
          {categories?.map((category, index) => (
            <tr key={category._id} className="hover:bg-[#bebebe1b] cursor-default border border-collapse">
              <td className="text-xl px-5 py-4 text-gray-700">{index + 1}</td>
              <td className="text-xl px-5 py-4 text-gray-700">{category.name}</td>
              <td className="text-xl px-5 py-4 text-gray-700 flex gap-5 justify-center items-center w-full">
                <FaRegTrashAlt
                  onClick={() => {
                    // Log for debugging
                    console.log("Deleting category:", category._id);
                    deleteMutation.mutate(category._id); // Trigger the mutation on click
                  }}
                  className="cursor-pointer text-red-600 text-2xl hover:opacity-[.7]"
                />
                <Link to={`edit/${category._id}`}>
                  <FaEdit className="cursor-pointer text-blue-600 text-2xl hover:opacity-[.7]" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Categories;
