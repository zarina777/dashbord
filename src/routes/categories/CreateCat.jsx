import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/api";

const CreateCat = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    // Show loading toast
    const toastId = toast.loading("Creating category...", { position: "bottom-right" });

    try {
      // API call to create category
      const res = await api.post("categories", data);

      if (res.status === 200) {
        // Update loading toast with success message
        toast.update(toastId, {
          render: "Successfully created new category!",
          type: "success",
          autoClose: 1500,
          isLoading: false,
          position: "bottom-right",
        });

        // Redirect to categories page after a short delay
        setTimeout(() => navigate("/categories"), 1500);
      }
    } catch (error) {
      // Handle error response
      if (error.response?.status === 400) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 5000, // Close after 5 seconds
        });
        localStorage.removeItem("info");
        navigate("/login");
      } else {
        toast.error("An error occurred. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center px-[100px]">
      <ToastContainer />
      <h1 className="text-white text-[40px] font-extrabold mb-7">Create a Category</h1>

      {/* Form for creating category */}
      <form className="flex flex-col gap-4 p-14 justify-around bg-white w-full rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl">Category Name</label>
        <input
          className={`p-3 border ${errors.name ? "border-red-500" : ""}`}
          type="text"
          {...register("name", { required: "Category name is required" })}
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}

        <button className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]" type="submit">
          Submit
        </button>
      </form>

      <Link to="/categories" className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg text-lg mt-5">
        <MdArrowBack /> <span>Back</span>
      </Link>
    </div>
  );
};

export default CreateCat;
