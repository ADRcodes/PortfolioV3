import { motion } from "motion/react";
import { pageVariants } from "../../lib/motion.js";

export default function AnimatedPage({ children, className = "" }) {
  return (
    <motion.main
      className={`mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28 ${className}`}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  );
}
