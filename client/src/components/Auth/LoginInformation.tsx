import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/ApiAthSlice";
import { setCredentials } from "../../features/UserSlice";

const LoginInformation = () => {
  const dispatch = useDispatch();
  const userRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    username: "",
    password: "",
  });

  const [login] = useLoginMutation();
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userData = await login({
      username: info.username,
      password: info.password,
    }).unwrap();

    dispatch(setCredentials(userData));
    setInfo({
      username: "",
      password: "",
    });

    navigate("/admin/home/etudiants");
  };

  const canSave = info.username.length > 0 && info.password.length > 0;

  return (
    <form className="w-full space-y-3">
      <input
        autoComplete="false"
        ref={userRef}
        type="text"
        name="username"
        value={info.username}
        placeholder="Username"
        onChange={handleInputChange}
        className="input input-bordered w-full focus:outline-none"
        required
      />

      <input
        type="password"
        name="password"
        value={info.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="input input-bordered w-full focus:outline-none"
        required
      />

      <div className="w-full flex items-center">
        <button
          onClick={handleSubmit}
          disabled={!canSave}
          className="px-4 py-2 hover:cursor-pointer disabled:cursor-not-allowed w-1/2 mt-[5%] text-center mx-auto rounded-md border border-black bg-white text-neutral-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginInformation;
