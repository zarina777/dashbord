import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Container from "../../components/container/Container";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  async function onSubmit(data) {
    try {
      let res = await axios.post("https://server-inky-eight-70.vercel.app/auth/login/admin", data);
      let info = await res.data;
      localStorage.setItem("info", JSON.stringify(info));
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError("server", { message: err.response.data.message });
      } else {
        // Generic error
        setError("server", { message: "An unexpected error occurred." });
      }

      // Clear the server error after a timeout
      setTimeout(() => {
        clearErrors("server");
      }, 4000); // Clears error after 4 seconds
    }
  }
  const navigate = useNavigate();
  return (
    <Container className="p-10 flex flex-col items-center justify-center bg-blue-100 h-[100vh]">
      <h1 className="text-white text-[50px] font-extrabold mb-12">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-20 justify-around  w-full rounded-lg">
        <label className="text-2xl text-white">Enter username</label>
        <input {...register("username", { required: "Username is required" })} className="p-3 border" type="text" />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

        <label className="text-2xl text-white">Enter password</label>
        <input {...register("password", { required: "Password is required" })} className="p-3 border" type="password" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {errors.server && <p className="text-red-500">{errors.server.message}</p>}

        <button className="items-end bg-blue-700 text-2xl p-4 text-white hover:bg-blue-500 rounded-[15px]" type="submit">
          submit
        </button>
      </form>
    </Container>
  );
};

export default Login;
