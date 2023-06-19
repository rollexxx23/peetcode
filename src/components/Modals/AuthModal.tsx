import React from 'react'

import Login from './Login';
import { useRecoilValue } from 'recoil';
import { authModalState } from '@/atoms/authAtoms';
import Register from './Register';
type AuthModalProps = {}

export default function AuthModal({}: AuthModalProps) {
    const authModal = useRecoilValue(authModalState);
    return (
        <>
            <div className='modal'>
            {authModal.type === "login" ? <Login /> : <Register/>}
            </div>
            
        </>
        
    );
  }