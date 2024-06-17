import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import TextField from "../../../components/TextField";
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
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
            Sign up
          </button>
          {isError && (
            <p className="text-red-500 font-light">Something went wrong</p>
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
