import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/capsules",
});

API.interceptors.request.use((config) => {

    const user = JSON.parse(localStorage.getItem("echoUser"));

    if (user?.token) {

        config.headers.Authorization = `Bearer ${user.token}`;

    }

    return config;

});

export const createCapsule = (data) =>
    API.post("/create", data);

export const getMyCapsules = () =>
    API.get("/my");