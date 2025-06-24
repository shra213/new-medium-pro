import { useEffect, useState } from "react";
import { type BlogsType } from "../components/BlogCard";
import axios from "axios";
import { blogsUrl } from "../config";
import { useNavigate } from "react-router-dom";
export function useBlog({ id }: { id: string }) {
  const navigate = useNavigate();
  const [loading, setloading] = useState<boolean>(true);
  const [blog, setblog] = useState<BlogsType | null>(null);
  useEffect(() => {
    async function fetchBlog() {
      try {
        console.log(`${blogsUrl}/${id}`);
        const res = await axios.get(`${blogsUrl}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.data.blog) {
          console.log(res.data);
          throw "error while fetchhing plz login again";
        }
        console.log(res.data);
        const blog = res.data.blog;
        setblog(blog);
        setloading(false);
        console.log(blog);
      } catch (e) {
        console.log(e);
        navigate("/myPosts");
      }
    }
    fetchBlog();
  }, []);

  return { loading, blog };
}

export function useBlogs() {
  const [loading, setloading] = useState<boolean>(true);
  const [blogs, setblogs] = useState<BlogsType[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        console.log(`${blogsUrl}/bulk/all`);
        const res = await axios.get(`${blogsUrl}/bulk/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.data.posts) {
          console.log("hii");
          throw "error while fetchhing plz login again";
        }
        console.log(res.data);
        const blogs = res.data.posts;
        setblogs(blogs);
        setloading(false);
        console.log(blogs);
      } catch (e) {
        alert("cant import");
        console.log(e);
      }
    }
    fetchBlogs();
  }, []);

  return { loading, blogs };
}
