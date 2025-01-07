import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../api/api";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// API function to fetch a single product
const fetchProduct = async (id) => {
  const response = await api.get(`products/${id}`);
  return response.data;
};

// API function to fetch all categories
const fetchCategories = async () => {
  const response = await api.get("categories");
  return response.data;
};

// API function to update a product
const updateProduct = async ({ id, data }) => {
  const userId = JSON.parse(localStorage.getItem("info"))?.userId;
  const response = await api.put(`products/${id}`, { ...data, user: userId });
  return response.data;
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  // Fetch the product data
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", id], // Unique query key
    queryFn: () => fetchProduct(id), // Fetch function
    enabled: !!id, // Only fetch if `id` is available
    // onSuccess: (data) => reset(data), // Populate the form with fetched data
  });

  useEffect(() => {
    reset(product);
  }, [id, product]);

  // Fetch the categories
  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Mutation for updating the product
  const { mutate, isLoading: isMutating } = useMutation({
    mutationFn: (data) => updateProduct({ id, data }),
    onSuccess: () => {
      toast.success("Product updated successfully!", {
        position: "bottom-right",
        autoClose: 1500,
      });
      setTimeout(() => navigate("/products"), 1500);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        position: "bottom-right",
        autoClose: 1500,
      });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    mutate(data); // Trigger mutation
  };

  if (productLoading || categoryLoading) {
    return <h1>Loading...</h1>;
  }

  if (productError || categoryError) {
    return <h1>Error loading data. Please try again later.</h1>;
  }

  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
      <ToastContainer />
      <h1 className="text-white text-[40px] font-extrabold">Edit Product</h1>
      <form className="flex flex-col gap-4 p-14 justify-around bg-white w-full rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl">Name of Product</label>
        <input className="p-3 border" type="text" {...register("name", { required: true })} />
        <label className="text-2xl">Price of Product</label>
        <input className="p-3 border" type="number" {...register("price", { required: true })} />
        <label className="text-2xl">Category of Product</label>
        <select className="p-3 border text-xl" {...register("category", { required: true })} defaultValue="">
          <option disabled value="">
            Select a category
          </option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]" type="submit" disabled={isMutating}>
          {isMutating ? "Updating..." : "Submit"}
        </button>
      </form>
      <Link to="/products" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg">
        <MdArrowBack /> <span>Back</span>
      </Link>
    </div>
  );
};

export default EditProduct;
