// AuthContext.js
import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../utils/fetch-services-without-token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const BaseURL = process.env.REACT_APP_BASE_URL;

  // const ipAddressDetail = fetch("https://api.ipdata.co")
  //     .then(response => {
  //         return response.json();
  //     }, "jsonp")
  //     .then(res => {
  //         console.log(res.ip)
  //     })
  //     .catch(err => console.log(err))

  // console.log(ipAddressDetail);

  const login = async (username, password) => {
    setLoading(true);
    const result = await postData("themeUser/login", {
      username: username,
      password: password,
    });
    console.log(result);
    if (result.success) {
      console.log(result);
      localStorage.setItem("user_info", JSON.stringify(result.data.user));
      localStorage.setItem("jws_token", result.data.token);
      setIsAuthenticated(true);
      setLoginError("");
      navigate("/theme-setting/");
    } else {
      setLoginError(result.message);
    }
    setLoading(false);
  };

  const resetPassword = async (request, token) => {
    setLoading(true);
    const result = await postData("auth/resetPassword", request);
    if (result.success) {
      localStorage.setItem("user_info", JSON.stringify(result.data));
      localStorage.setItem("jws_token", token);
      setIsAuthenticated(true);
      setLoginError("");
      navigate("/dashboard", { state: { newUser: true, user: result.data } });
    } else {
      setLoginError(result.message);
    }
    setLoading(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    const drf = localStorage.getItem("dfr_buf");
    const frr = localStorage.getItem("frr_buf");
    localStorage.clear();
    localStorage.setItem("dfr_buf", drf);
    localStorage.setItem("frr_buf", frr);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginError, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
