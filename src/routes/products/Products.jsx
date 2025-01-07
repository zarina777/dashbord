import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fetch products based on selected category
const fetchProducts = async (selectedCat) => {
  const response = await api.get(`products?category=${selectedCat}`);
  return response.data;
};

// Fetch categories
const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Delete product
const deleteProductApi = async (id) => {
  const response = await api.delete(`products/${id}`);
  return response.data;
};

const Products = () => {
  const [selectedCat, setSelectedCat] = useState("all");
  const queryClient = useQueryClient();
  const userId = JSON.parse(localStorage.getItem("info"))?.userId;
  // Use useQuery for fetching categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorMessage,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    onError: (error) => {
      toast.error("Error loading categories: " + error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Use useQuery for fetching products based on selected category
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorMessage,
  } = useQuery({
    queryKey: ["products", selectedCat],
    queryFn: () => fetchProducts(selectedCat),
    keepPreviousData: true,
    onError: (error) => {
      toast.error("Error loading products: " + error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Use useMutation for deleting a product
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: (data, variables) => {
      toast.success("Deleted successfully", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Invalidate the products query to refetch the data after deletion
      queryClient.invalidateQueries(["products", selectedCat]);
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Handle product deletion
  const deleteProduct = (id) => {
    deleteMutation.mutate(id);
  };

  // Handle error for fetching products
  if (productsError) {
    return <div className="text-red-500 text-center">Error loading products: {productsErrorMessage.message}</div>;
  }

  // Handle error for fetching categories
  if (categoriesError) {
    return <div className="text-red-500 text-center">Error loading categories: {categoriesErrorMessage.message}</div>;
  }

  return (
    <div className="overflow-x-auto py-6">
      <ToastContainer />
      <div className="flex justify-end items-start gap-3">
        {/* Select category */}
        <select className="p-2 border-none bg-slate-50 outline-none rounded-md" value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
          <option value="all">All</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Link to create a new product */}
        <Link to="create" className="bg-blue-600 text-white rounded-md px-3 py-2 mb-10">
          Create new product
        </Link>
      </div>

      <h2 className="text-white text-3xl text-center font-extrabold mb-7">Products</h2>

      <table className="min-w-full border-collapse border border-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr className="bg-[#1ccaff]">
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">No_</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Product Name</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Product Price</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Product Category</th>
            <th className="text-xl px-5 py-4 text-left font-semibold text-white">Control</th>
          </tr>
        </thead>
        <tbody>
          {productsLoading && (
            <tr>
              <td colSpan={6} className="p-10">
                <div className="loader m-auto"></div>
              </td>
            </tr>
          )}
          {products?.length == 0 && (
            <tr>
              <td colSpan={6} className="text-xl px-4 py-10 text-gray-700 text-center">
                No product
              </td>
            </tr>
          )}
          {products?.map((product, index) => {
            if (product.user._id == userId) {
              return (
                <tr key={product._id} className="hover:bg-[#bebebe1b] cursor-default border border-collapse">
                  <td className="text-xl px-5 py-4 text-gray-700">{index + 1}</td>
                  <td className="text-xl px-5 py-4 text-gray-700">{product.name}</td>
                  <td className="text-xl px-5 py-4 text-gray-700">{product.price}$</td>
                  <td className="text-xl px-5 py-4 text-gray-700">{product.category.name}</td>
                  <td className="text-xl px-5 py-4 text-gray-700 flex gap-5 justify-center items-center w-full">
                    {/* Delete product button */}
                    <FaRegTrashAlt
                      onClick={() => deleteProduct(product._id)} // Trigger delete mutation
                      className="cursor-pointer text-red-600 text-2xl hover:opacity-[.7]"
                    />
                    {/* Edit product button */}
                    <Link to={`edit/${product._id}`}>
                      <FaEdit className="cursor-pointer text-blue-600 text-2xl hover:opacity-[.7]" />
                    </Link>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
