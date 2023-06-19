import { auth, firestore } from "@/firebase/firebase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LogoutButton from "../Buttons/logout";
import router from "next/router";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authAtoms";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Problem/Timer/timer";
import Head from "next/head";
import { toast } from "react-toastify";

import { doc, getDoc, updateDoc } from "firebase/firestore";

type TopbarProps = {
  problemPage: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  const [isPremium, setPremium] = useState(false);

  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  // useEffect(() => {
  //   const fetchStatus = async () => {
  //     const [user] = useAuthState(auth);
  //     if (user == null) {
  //       setPremium(false);
  //     } else {
  //       const userRef = doc(firestore, "users", user!.uid);
  //       const userSnap = await getDoc(userRef);
  //       if (userSnap.exists()) {
  //         const data = userSnap.data();
  //         const { premiumUser } = data;
  //         setPremium(premiumUser);
  //       }
  //     }
  //   };
  //   fetchStatus();
  // });
  const loginRouteHandler = () => {
    router.push("/auth");
    setAuthModalState((prev) => ({ type: "login", isOpen: true }));
  };

  const makePayment = async () => {
    if (!user) {
      toast.error("You must be logged in buy premium", {
        position: "top-left",
        theme: "dark",
      });

      return;
    }
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
      t.json()
    );
    console.log(data);
    var options = {
      key: "rzp_test_7Him8lhDaX2Mye", // Enter the Key ID generated from the Dashboard
      name: "Peetcode",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thankyou for your test donation",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png?20190719232508",
      handler: function (response: any) {
        // Validate payment at server - using webhooks is a better idea.
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        paymentSuccessHandler();
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const paymentSuccessHandler = async () => {
    toast("Payment Success", {
      position: "top-left",
      theme: "dark",
    });
    const userRef = doc(firestore, "users", (user as any).uid);
    await updateDoc(userRef, {
      premium: true,
    });
  };
  const func = () => {};
  return (
    <nav className="relative flex h-[60px] w-full shrink-0 items-center px-5 bg-white shadow text-dark-gray-7">
      <Head>
        <meta
          name="description"
          content="Integrate payments in your React and Next.js application with TailwindCSS and Razorpay"
        />
      </Head>
      <div
        className={`flex w-full items-center justify-between  mx-auto ${
          !problemPage ? "max-w-[1200px] mx-auto" : ""
        }`}
      >
        <Link href="/" className="h-[22px] flex-1">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-leetcode-3628885-3030025.png"
            alt="Logo"
            className="h-full"
          />
        </Link>

        {problemPage && (
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer">
              <FaChevronLeft />
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
            >
              <div>
                <BsList />
              </div>
              <p className="mt-8">Problem List</p>
            </Link>
            <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer">
              <FaChevronRight />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <button
            onClick={!isPremium ? makePayment : func}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
          >
            {!isPremium ? "Buy Premium" : "Premium Member"}
          </button>
          {!user && (
            <button
              onClick={loginRouteHandler}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Sign In
            </button>
          )}
          {user && problemPage && <Timer />}
          {user && (
            <div className="cursor-pointer group relative">
              <img
                src="https://img.uxwing.com/wp-content/themes/uxwing/download/peoples-avatars-thoughts/avatar-icon.png"
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              <div
                className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-black p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out"
              >
                <p className="text-sm text-white">{user.email}</p>
              </div>
            </div>
          )}

          {user && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
