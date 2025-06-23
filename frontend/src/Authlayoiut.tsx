// AuthLayout.tsx
import { motion } from "framer-motion";
import Quote from "./components/Quote";
import Auth from "./components/Auth";

export default function AuthLayout({ authtype }: { authtype: "signup" | "signin" }) {
  const isSignup = authtype === "signup";

  return (
    <div className="overflow-hidden grid grid-cols-1 h-screen w-screen lg:grid-cols-2 relative">
      <motion.div
        key={`${authtype}-auth`}
        initial={{ x: isSignup ? "-100%" : "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: isSignup ? "100%" : "-100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <Auth authtype={authtype} />
      </motion.div>

      <motion.div
        key={`${authtype}-quote`}
        initial={{ x: isSignup ? "100%" : "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: isSignup ? "-100%" : "100%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="invisible lg:visible z-0"
      >
        <Quote />
      </motion.div>
    </div>
  );
}
