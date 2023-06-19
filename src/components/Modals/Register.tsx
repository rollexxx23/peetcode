import { authModalState } from "@/atoms/authAtoms";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

type RegisterProps = {};

export default function Register({}: RegisterProps) {
  const setAuthModalState = useSetRecoilState(authModalState);
  const loginHandler = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };
  const closeModalHandler = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const [inputs, setInputs] = useState({
    email: "",
    display: "",
    password: "",
  });
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(inputs);
  };

  const registerSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("inputs->", inputs);
    try {
      const newUser = await createUserWithEmailAndPassword(
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
      const userData = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        displayName: inputs.display,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        likedProblems: [],
        dislikedProblems: [],
        solvedProblems: [],
        starredProblems: [],
        premiumUser: false,
      };
      await setDoc(doc(firestore, "users", newUser.user.uid), userData);
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
        <h1>Register for LeetClone</h1>
        <form onSubmit={registerSubmitHandler}>
          <label htmlFor="display">Display Name</label>
          <input
            onChange={inputChangeHandler}
            type="text"
            name="display"
            id="display"
            placeholder="Enter your display name"
            required
          />
          <label htmlFor="email">Email</label>
          <input
            onChange={inputChangeHandler}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            onChange={inputChangeHandler}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
          />
          <button type="submit" className="btn">
            Register
          </button>
        </form>
        <div className="login-text">
          Already have an account? <div onClick={loginHandler}>Log In</div>
        </div>
      </div>
    </>
  );
}
