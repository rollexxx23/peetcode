import { authModalState } from "@/atoms/authAtoms";
import { auth } from "@/firebase/firebase";
import router from "next/router";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
type LoginProps = {};

export default function Login({}: LoginProps) {
  const setAuthModalState = useSetRecoilState(authModalState);
  const registerHandler = () => {
    setAuthModalState((prev) => ({ ...prev, type: "register" }));
  };

  const closeModalHandler = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs);
  };

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const loginSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("inputs->", inputs);
    try {
      const newUser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) {
        toast.error(error?.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }
      router.push("/");
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };
  return (
    <>
      <div className="modal-container">
        <IoClose onClick={closeModalHandler} className="h-5 w-5 ml-auto" />
        <h1>Sign in to LeetClone</h1>
        <form onSubmit={loginSubmitHandler}>
          <label htmlFor="email">Email</label>
          <input
            onChange={inputChangeHandler}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={inputChangeHandler}
            name="password"
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <div className="not-registered">
          Not registered yet? <div onClick={registerHandler}>Sign up</div>
        </div>
      </div>
    </>
  );
}
