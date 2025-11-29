import React from "react";
import { motion } from "framer-motion";
import logo from "../../images/logo.jpg"
import { Outlet } from "react-router";

const messages = [
  "Welcome to Our Platform ",
  "Connect. Create. Conquer.",
  "Your Journey Starts Here ",
  "Secure • Modern • Simple",
];

const AuthLayout = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-white/60 backdrop-blur-lg shadow-lg
                  min-h-screen lg:min-h-0">
          <div className="w-full max-w-md bg-white/80 rounded-3xl p-8 shadow-xl border border-blue-100 overflow-y-auto max-h-[90vh]">
            <Outlet />
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-2/5 flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-10 relative overflow-hidden">
          <div className="flex flex-col gap-5">
            <img src={logo} className="max-w-40 rounded-full" />
          </div>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="text-3xl lg:text-4xl font-extrabold text-center drop-shadow-lg"
          >
            {messages[index]}
          </motion.div>
          <p className="mt-6 text-center text-lg opacity-80">
            Where innovation meets simplicity. Join our growing community today.
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
