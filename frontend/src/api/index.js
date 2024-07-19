import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token
      }`;
  }
  return req;
});

export const login = (formData) => API.post("/api/user/login", formData);
export const signUp = (formData) => API.post("/api/user/signup", formData);
export const changePassword = (formData) =>
  API.post("/api/user/changePassword", formData);

export const getLedgerBalance = () => API.get("/api/ledger/balance");
export const getLedgerEntries = () => API.get("/api/ledger/entries");
export const getGiphyCointoss = () => API.get("/api/giphy/coin_flip");

export const wager = (formData) => API.post("/api/wager", formData);