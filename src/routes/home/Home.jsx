import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/api";
const fetchData = async (id) => {
  const res = await api.get(`users/${id}`);
  return res.data;
};

const Home = () => {
  let id = JSON.parse(localStorage.getItem("info"))?.userId;
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchData(id),

    onError: (error) => {
      console.error(error);
      toast.error("Error fetching user data.");
    },
    enabled: !!id, // Only run the query if the id is available
  });
  if (isLoading) {
    return <h1>Loading ...</h1>;
  }
  if (isError) {
    return <h1>{error}</h1>;
  }
  return (
    <div className="p-6">
      Wellcome Home page, <span className="text-blue-900 text-2xl">{data?.username}</span>
    </div>
  );
};

export default Home;
