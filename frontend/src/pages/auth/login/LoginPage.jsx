import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";
import TextField from "../../../components/TextField";
import { RxAvatar } from "react-icons/rx";
import { RiLockPasswordLine } from "react-icons/ri";
import XSvg from "../../../components/svgs/X";

const LoginPage = () => {
  const [formData, setFromData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-bold text-white">Let's go</h1>
          <TextField
            icon={<RxAvatar />}
            type="text"
            placeholder="Username"
            name="username"
            inputChange={handleInputChange}
            value={formData.username}
          />
          <TextField
            icon={<RiLockPasswordLine />}
            type="password"
            placeholder="Password"
            name="password"
            inputChange={handleInputChange}
            value={formData.password}
          />
          <button className="btn btn-primary rounded-full text-white">
            Login
          </button>
          {isError && (
            <p className="text-red-500 font-light">Something went wrong</p>
          )}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Don't have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
