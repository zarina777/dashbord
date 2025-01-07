import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "../../api/api"; // Assuming you have an axios instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa"; // Assuming you're using icons

// Fetch Users function with Axios (handling error and response properly)
const fetchUsers = async () => {
  try {
    const response = await api.get("users");
    return response.data; // Axios automatically parses the response to JSON
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

// Delete User function (returns a promise for mutation)
const deleteUser = async (id) => {
  await api.delete(`users/${id}`);
};

const Users = () => {
  const queryClient = useQueryClient();

  // Fetching users using useQuery
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["users"], // Key for caching and identification
    queryFn: fetchUsers, // Function to fetch data
  });

  // Mutation to delete user
  const {
    mutate,
    isLoading: isDeleting,
    isError: isDeleteError,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // After successful delete, invalidate the users query to refetch the data
      queryClient.invalidateQueries(["users"]);
      toast.info("Deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete user");
    },
  });

  return (
    <>
      <div className="overflow-x-auto py-6 flex flex-col">
        <ToastContainer />
        <div className="flex justify-end">
          <Link to="create" className="bg-blue-600 text-white rounded-md px-3 py-2 mb-10">
            Create new user
          </Link>
        </div>
        {isError && (
          <div className="text-red-600 text-center p-4">
            <p>Error: {error.message}</p>
          </div>
        )}
        <table className="min-w-full border-collapse border border-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr className="bg-[#1ccaff]">
              <th className="text-xl px-5 py-4 text-left font-semibold text-white">No_</th>
              <th className="text-xl px-5 py-4 text-left font-semibold text-white">User Name</th>
              <th className="text-xl px-5 py-4 text-left font-semibold text-white">User type</th>
              <th className="text-xl px-5 py-4 text-left font-semibold text-white">Control</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="loader m-auto"></div>
                </td>
              </tr>
            )}

            {data?.map((user, index) => (
              <tr key={user._id} className="hover:bg-[#bebebe1b] cursor-default border border-collapse">
                <td className="text-xl px-5 py-4 text-gray-700">{index + 1}</td>
                <td className="text-xl px-5 py-4 text-gray-700">{user.username}</td>
                <td className="text-xl px-5 py-4 text-gray-700">{user.type}</td>
                <td className="text-xl px-5 py-4 text-gray-700 flex gap-5 justify-center items-center w-full">
                  <FaRegTrashAlt
                    onClick={() => mutate(user._id)} // Call mutate with the user id
                    className="cursor-pointer text-red-600 text-2xl hover:opacity-[.7]"
                    disabled={isDeleting} // Disable button when deleting
                  />
                  <Link to={`${user._id}/edit`}>
                    <FaEdit className="cursor-pointer text-blue-600 text-2xl hover:opacity-[.7]" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Users;
