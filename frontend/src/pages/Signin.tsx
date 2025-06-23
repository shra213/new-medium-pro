import Quote from "../components/Quote";
import Auth from "../components/Auth";
import { motion } from "framer-motion";

export default function Signin() {
  return (
    <div className="overflow-hidden h-screen w-screen flex flex-col lg:flex-row-reverse relative">
      {/* ✅ Auth (should appear on right on desktop) */}
      <motion.div
        key="auth-signin"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 z-10"
      >
        <Auth authtype="signin" />
      </motion.div>

      {/* ✅ Quote (on left on desktop) */}
      <motion.div
        key="quote-signin"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 invisible lg:visible z-0"
      >
        <Quote />
      </motion.div>
    </div>
  );
}
