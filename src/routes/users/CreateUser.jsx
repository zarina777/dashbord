import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// POST request function for creating a user
const createUser = async (data) => {
  const res = await axios.post("https://server-inky-eight-70.vercel.app/auth/register", data);
  return res.data;
};

const CreateUser = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Set up the mutation using useMutation
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Successfully created new user", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate("/users"), 1500);
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
        {/* Show error for username */}
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        <label className="text-2xl">Password of user</label>
        <input
          className={`p-3 border ${errors.password ? "border-red-500" : ""}`}
          type="text"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {/* Show error for password */}
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
        {/* Show error for type */}
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}

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

export default CreateUser;
