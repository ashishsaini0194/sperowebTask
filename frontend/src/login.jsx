import React, { useState } from "react";

function LoginForm({ setIsLoggedIn }) {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3008/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormData),
    })
      .then((res) => {
        res.json().then((data) => {
          alert(data?.message || "logged in successfully");
          localStorage.setItem("user", JSON.stringify(data));
        });
        setIsLoggedIn(true);
      })
      .catch((err) => {
        alert(err?.message || "error while logging in");
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={loginFormData.email}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={loginFormData.password}
            onChange={handleLoginChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
