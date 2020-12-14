import axios from "axios";
import store from "@/store/store.js";

const apiClient = axios.create({
    baseURL: store.state.url,
    withCredentials: false, // This is the default
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

export { apiClient };
