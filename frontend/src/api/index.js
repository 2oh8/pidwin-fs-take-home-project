import axios from "axios";

const runAsProduction = true

const url = runAsProduction ? "https://api.gamblinjacks.com/" : "http://localhost:8080/"

const API = axios.create({ baseURL: url });
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
export const getLeaderboard = () => API.get("/api/ledger/leaderboard");
export const getGiphyCointoss = () => API.get("/api/giphy/coin+flip");

export const wager = (formData) => API.post("/api/wager", formData);