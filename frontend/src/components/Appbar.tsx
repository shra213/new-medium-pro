import { useEffect } from "react";
import { Circle } from "./BlogCard";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { blogsUrl } from "../config";

export function Appbar({
  id,
  title,
  content,
  setpublish,
}: {
  id?: string;
  title?: string;
  content?: string;
  setpublish?: any;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Verify user
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${blogsUrl}/auth/me `, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.data || !res.data.user) {
          throw new Error("User not authenticated");
        }
        // Optional: console.log("✅ User verified:", res.data.user);
      } catch (err) {
        console.error("❌ Authentication failed:", err);
        navigate("/signup");
      }
    };

    verifyUser();
  }, []);

  const handleClick = async () => {
    if (location.pathname === "/create") {
      try {
        const res = await axios.post(
          `${blogsUrl}`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.data.post) {
          alert("Please sign in again");
          navigate("/signin");
          return;
        }

        setpublish(true);
        setTimeout(() => setpublish(false), 3000);
        navigate("/");
      } catch (err) {
        console.error("❌ Post failed:", err);
      }
    } else if (location.pathname.startsWith("/post/update") && id) {
      try {
        const res = await axios.put(
          `${blogsUrl}`,
          {
            id,
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.data.post) {
          alert("Failed to update post");
          return;
        }

        setpublish(true);
        setTimeout(() => setpublish(false), 3000);
        navigate("/");
      } catch (err) {
        console.error("❌ Update failed:", err);
      }
    } else {
      navigate("/create");
    }
  };

  return (
    <div className="px-10 mx-5 mt-3 py-2 items-center border-b border-gray-100 flex justify-between">
      <Link to={"/"}>
        <div className="text-2xl font-bold font-serif tracking-tight text-gray-800">
          Medium
        </div>
      </Link>
      <div className="flex gap-1 md:gap-6">
        <button
          onClick={handleClick}
          className="bg-green-700 hover:bg-green-800 text-white text-sm px-2 md:px-4 rounded-full transition-all duration-200"
        >
          {location.pathname === "/create" ||
          location.pathname === "/post/update"
            ? "Submit"
            : "Write"}
        </button>
        <Link to={"/myPosts"}>
          <Circle name={localStorage.getItem("icon")} size="large" />
        </Link>
      </div>
    </div>
  );
}
