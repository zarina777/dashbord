import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "./verifyToken";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken();

      if (!isValid) {
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
