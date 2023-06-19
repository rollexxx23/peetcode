import { authModalState } from '@/atoms/authAtoms';
import React from 'react'
import { useSetRecoilState } from 'recoil';
type NavBarProps = {}

export default function Navbar({}: NavBarProps) {
    const setAuthModalState = useSetRecoilState(authModalState);
	const handleClick = () => {
		setAuthModalState((prev) => ({ type: "login", isOpen: true }));
	};
  return (
  <div className="sticky-top-bar">
      <div className="top-bar">
          <div className="logo">
              <img src="https://cdn.iconscout.com/icon/free/png-256/free-leetcode-3628885-3030025.png" alt="Company Logo"/>
              </div>
          <div className="right-section">
              
              
                  <button className="login-button" onClick={handleClick} >Login</button>
          </div>
      </div>
  </div>
  );
}