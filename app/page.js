"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";

// export default function Page() {
//   const router = useRouter();
//   const { user } = useUser();

//   useEffect(() => {
//     router.push("/app"); // Redirect programmatically
//   }, [user]);

//   return <div>Redirecting...</div>;
// }
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Subscribers } from "configs/schema";
import { db } from "configs/db";

export default function ComingSoon() {
  const [email, setEmail] = useState();
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-06-01").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dodajCekanje = async () => {
    if (!!email) {
      let vrednost = {
        email: email
      }
      const dodaeno = await db.insert(Subscribers).values(vrednost);

      if (!!dodaeno) {
        alert("You have been added to the waitlist. Thank you!");
        setEmail(``);
      }
    } else {
      alert("Please enter your email address to join the waitlist.");
    }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white text-center p-6">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold mb-4 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Coming Soon
      </motion.h1>
      <motion.p
        className="text-lg md:text-2xl mb-6 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Something amazing is on the way. Stay tuned!
      </motion.p>
      <motion.div
        className="flex space-x-6 text-2xl md:text-5xl font-semibold p-4 rounded-lg shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center px-10">
            <span className="text-blue-500">{value || 0}</span>
            <span className="text-sm uppercase text-gray-400">{unit}</span>
          </div>
        ))}
      </motion.div>
      <motion.p
        className="mt-6 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Subscribe to get notified when we launch:
      </motion.p>
      <motion.div
        className="mt-4 flex space-x-2 bg-gray-800 p-2 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Join waitlist..."
          className="p-3 rounded-lg text-white text-black w-60 outline-none"
        />
        <button onClick={dodajCekanje} className="bg-blue-500 cursor-pointer hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold transition duration-300">
          Join
        </button>
      </motion.div>
    </div>
  );
}

