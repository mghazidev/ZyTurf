// import OnBoardForm from "@/modules/registration/form/OnBoardForm";
// const page = () => {
//   return <OnBoardForm />;
// };

// export default page;

"use client";
import { motion } from "framer-motion";
import OnBoardForm from "@/modules/registration/form/OnBoardForm";

const Page = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Blurred Neon Background */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/30 to-transparent blur-[150px]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/30 to-transparent blur-[150px]"></div>

      {/* Animated Form Container */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 rounded-2xl p-8 w-full max-w-lg"
      >
        <OnBoardForm />
      </motion.div>
    </div>
  );
};

export default Page;
