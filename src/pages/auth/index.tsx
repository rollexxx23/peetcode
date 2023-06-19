import { authModalState } from "@/atoms/authAtoms";
import CardCarousel from "@/components/Auth/Carousel";
import Navbar from "@/components/Auth/Navbar";
import AuthModal from "@/components/Modals/AuthModal";
import { auth } from "@/firebase/firebase";
import router from "next/router";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";

type AuthPageProps = {};

export default function AuthPage({}: AuthPageProps) {
  const authModal = useRecoilValue(authModalState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(true);
  const registerHandler = () => {
    setAuthModalState((prev) => ({ isOpen: true, type: "register" }));
  };

  useEffect(() => {
    if (user) router.push("/");
    if (!loading && !user) setPageLoading(false);
  }, [user, router, loading]);

  if (pageLoading) return null;
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>A New Way to Learn</h1>
        <p>
          LeetCode is the best platform to help you enhance your skills, expand
          your knowledge, and prepare for technical interviews.
        </p>
        <div onClick={registerHandler} className="btn">
          Create Account
        </div>
      </div>
      {authModal.isOpen && <AuthModal />}
      <div className="company-logos">
        <i className="fab fa-facebook-square company-logo"></i>
        <i className="fab fa-apple company-logo"></i>
        <i className="fab fa-amazon company-logo"></i>
        <i className="fab fa-google company-logo"></i>
        <i className="fab fa-microsoft company-logo"></i>
      </div>
      <CardCarousel />

      <footer className="footer">
        <div className="footer-links">
          <a href="/help">Help Center</a>
          <a href="/students">Students</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
        <div className="footer-location">United States</div>
        <div className="footer-copyright">&copy; 2023 LeetCode</div>
      </footer>
    </>
  );
}
