import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import TextField from "../../../components/TextField";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created sucessfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <h1 className="text-4xl font-bold text-white">Join today.</h1>
          <TextField
            icon={<MdOutlineMail />}
            type="email"
            placeholder="Email"
            name="email"
            inputChange={handleInputChange}
            value={formData.email}
          />
          <TextField
            icon={<RxAvatar />}
            type="text"
            placeholder="Username"
            name="username"
            inputChange={handleInputChange}
            value={formData.username}
          />
          <TextField
            icon={<MdDriveFileRenameOutline />}
            type="text"
            placeholder="Full name"
            name="fullName"
            inputChange={handleInputChange}
            value={formData.fullName}
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
            {isPending ? "Loading..." : "Sign up"}
          </button>
          {isError && (
            <p className="text-red-500 font-light">{error.message}</p>
          )}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Log in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
