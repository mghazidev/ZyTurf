import axios, { AxiosInstance } from "axios";

const useAxiosAuth = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: "http://localhost:5080/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
};

export default useAxiosAuth;
