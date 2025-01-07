import api from "../../api/api";

export const verifyToken = async () => {
  const token = JSON.parse(localStorage.getItem("info"))?.token;

  // Step 1: Check if the token exists
  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    // Step 3: Verify the token with the server
    const response = await api.post("auth/verify-token", { token });

    if (response.status === 200) {
      console.log("Token is valid");
      return true;
    } else {
      console.log("Token is invalid");
      return false;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    localStorage.removeItem("info");
    return false;
  }
};
