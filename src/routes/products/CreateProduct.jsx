import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";

// POST request function for creating a user
const createUser = async (data) => {
  let userId = JSON.parse(localStorage.getItem("info"))?.userId;
  const res = await api.post("products", { ...data, user: userId });
  return res.data;
};
const fetchCategories = async () => {
  const res = await api.get("categories");
  return res.data;
};
const CreateProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: categories,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"], // Key to uniquely identify the query
    queryFn: fetchCategories, // Function to fetch categories
  });
  // Set up the mutation using useMutation
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Successfully created new product", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate("/products"), 1500);
    },
    onError: (err) => {
      toast.error("Failed to create user: " + (err.response?.data?.message || err.message));
    },
  });

  // On form submission, call the mutation
  const onSubmit = (data) => {
    mutate(data); // Trigger the mutation
  };

  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
      <ToastContainer />
      <h1 className="text-white text-[40px] font-extrabold items-end">Create a User</h1>
      {/* Attach the handleSubmit function */}
      <form className="flex flex-col gap-4 p-14 justify-around bg-white w-full rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl">Product name</label>
        <input
          className={`p-3 border ${errors.name ? "border-red-500" : ""}`}
          type="text"
          {...register("name", {
            required: "Name is required",
          })}
        />
        {/* Show error for username */}
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <label className="text-2xl">Price of product</label>
        <input
          className={`p-3 border ${errors.price ? "border-red-500" : ""}`}
          type="number"
          {...register("price", {
            required: "Price is required",
          })}
        />
        {/* Show error for price */}
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <label className="text-2xl">Category of Product</label>
        <select
          className={`p-3 border text-xl ${errors.type ? "border-red-500" : ""}`}
          {...register("category", { required: "category is required" })}
        >
          {categories?.map((category) => (
            <option className="text-xl" value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {/* Show error for type */}
        {errors.category && <p className="text-red-500 text-sm">{errors.type.message}</p>}

        <button
          className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]"
          type="submit"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </form>

      <Link to="/users" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg">
        <MdArrowBack /> <span>Back</span>
      </Link>

      {/* Optionally show error messages */}
      {isError && <p className="text-red-600 mt-4">{error.message}</p>}
    </div>
  );
};

export default CreateProduct;
