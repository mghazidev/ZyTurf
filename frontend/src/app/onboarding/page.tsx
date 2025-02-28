// import OnBoardForm from "@/modules/registration/form/OnBoardForm";
// const page = () => {
//   return <OnBoardForm />;
// };

// export default page;

// "use client";
// import { motion } from "framer-motion";
// import OnBoardForm from "@/modules/registration/form/OnBoardForm";

// const Page = () => {
//   return (
//     <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Blurred Neon Background */}
//       <div className="absolute inset-0 bg-gradient-radial from-green-500/30 to-transparent blur-[150px]"></div>
//       <div className="absolute inset-0 bg-gradient-radial from-blue-500/30 to-transparent blur-[150px]"></div>

//       {/* Animated Form Container */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="relative bg-white/10 backdrop-blur-lg shadow-lg border border-white/20 rounded-2xl p-8 w-full max-w-lg"
//       >
//         <OnBoardForm />
//       </motion.div>
//     </div>
//   );
// };

// export default Page;
"use client";
import { motion } from "framer-motion";
import OnBoardForm from "@/modules/registration/form/OnBoardForm";

const floatingVariants = {
  animate: {
    y: [0, 15, 0],
    x: [0, -15, 15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: "reverse" as "reverse",
      ease: "easeInOut",
    },
  },
};

const Page = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 overflow-hidden">
      {/* Blurred Neon Background */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/40 to-transparent blur-[200px]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/40 to-transparent blur-[200px]"></div>
      <div className="absolute inset-0 bg-gradient-radial from-orange-400/30 to-transparent blur-[180px]"></div>

      {/* Moving Sports Icons */}
      <motion.img
        src="/basketball.png"
        alt="Basketball"
        className="absolute top-10 left-24 w-24 opacity-90 drop-shadow-[0_0_10px_orange]"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.img
        src="/football.png"
        alt="Football"
        className="absolute bottom-30 left-1/5 w-28 opacity-90 drop-shadow-[0_0_10px_white]"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.img
        src="/bat.png"
        alt="Cricket Bat"
        className="absolute top-1/2 left-10 w-32 opacity-90 rotate-45 drop-shadow-[0_0_10px_brown]"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.img
        src="/tennisball.png"
        alt="Tennis Ball"
        className="absolute bottom-10 left-1/3 w-16 opacity-90 drop-shadow-[0_0_10px_yellow]"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.img
        src="/volleyball.png"
        alt="Volleyball"
        className="absolute top-20 left-1/3 w-20 opacity-90 drop-shadow-[0_0_10px_blue]"
        variants={floatingVariants}
        animate="animate"
      />

      {/* Form Container moved to the right */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute right-10 bg-white/10 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl p-8 w-full max-w-lg"
      >
        <OnBoardForm />
      </motion.div>
    </div>
  );
};

export default Page;
