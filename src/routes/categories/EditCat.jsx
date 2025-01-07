import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCat = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  useEffect(() => {
    if (id) {
      api
        .get(`categories/${id}`)
        .then((res) => {
          reset(res.data); // Populate form with existing product data
          //   console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [id, reset]);
  const onSubmit = async (data) => {
    try {
      let res = await api.put(`categories/${id}`, data);
      if (res.status === 200) {
        toast.success("Successfully updated category", {
          position: "bottom-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => navigate("/categories"), 1500);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
      <ToastContainer />
      <h1 className="text-white text-[40px] font-extrabold">Edit Product</h1>
      {/* Attach the handleSubmit function */}
      <form className="flex flex-col gap-4 p-14 justify-around bg-white w-full rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl">Name of category</label>
        {/* Register input fields */}
        <input className="p-3 border" type="text" {...register("name", { required: true })} />
        <button className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]" type="submit">
          submit
        </button>
      </form>
      <Link to="/products" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg">
        <MdArrowBack /> <span>back</span>
      </Link>
    </div>
  );
};

export default EditCat;
