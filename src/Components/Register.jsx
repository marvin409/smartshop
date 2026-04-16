import React, { useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(buildApiUrl("/api/register"), form)
      .then(res => alert(res.data.message))
      .catch(err => alert(err.response.data.error));
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
