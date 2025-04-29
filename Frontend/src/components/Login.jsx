import React, { useState } from 'react'
import axios from "axios";
import "../styles/login.css"

const Login = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [formData, setFormData] = useState({
     name: "",
     email: "",
     password: "",
   });

   const handleChange = (e) => {
     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e) => {
     e.preventDefault();
     const endpoint = isLogin ? "/api/login" : "/api/register";
     try {
       const res = await axios.post(endpoint, formData);
       alert(res.data.message || "Success");
     } catch (err) {
       alert(err.response?.data?.message || "Something went wrong");
     }
   };

   return (
     <div className="auth-container">
       <div className="auth-box">
         <h2>{isLogin ? "Login" : "Register"}</h2>
         <form onSubmit={handleSubmit}>
           {!isLogin && (
             <input
               type="text"
               name="name"
               placeholder="Name"
               value={formData.name}
               onChange={handleChange}
               required
             />
           )}
           <input
             type="email"
             name="email"
             placeholder="Email"
             value={formData.email}
             onChange={handleChange}
             required
           />
           <input
             type="password"
             name="password"
             placeholder="Password"
             value={formData.password}
             onChange={handleChange}
             required
           />
           <button type="submit">{isLogin ? "Login" : "Register"}</button>
         </form>
         <p onClick={() => setIsLogin(!isLogin)}>
           {isLogin
             ? "Don't have an account? Register"
             : "Already have an account? Login"}
         </p>
       </div>
     </div>
   );
}

export default Login