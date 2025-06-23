import { useEffect, useState } from "react";
import axios from "axios";
import { blogsUrl } from "../config";
import { useNavigate } from "react-router-dom";

type Post = {
  id: string;
  title: string;
  content: string;
  Published: boolean;
  date: string;
};

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await axios.get(`${blogsUrl}/mine/allpost`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPosts(res.data.myPosts || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch your posts");
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string) {
    try {
      const res = await axios.post(
        `${blogsUrl}/publish`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(res.data.msg || "Post updated");
      fetchPosts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update post status");
    }
  }

  async function deletePost(id: string) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${blogsUrl}/delete/${id}`, {
        data: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage(res.data.msg || "🗑️ Post deleted");
      fetchPosts();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete post");
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">📄 My Posts</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  post.Published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {post.Published ? "Published ✅" : "UnPublished ⚠️"}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {new Date(post.date).toLocaleString()}
            </p>
            <p className="text-gray-800 mb-4">{post.content}</p>
            <div className="flex flex-wrap gap-5">
              <button
                onClick={() =>
                  navigate("/create", {
                    state: {
                      id: post.id,
                      prevtitle: post.title,
                      prevcontent: post.content,
                    },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
              >
                ✏️ Update
              </button>

              <button
                onClick={() => togglePublish(post.id)}
                className={`${
                  post.Published ? "bg-yellow-600" : "bg-green-600"
                } hover:opacity-90 text-white px-4 py-1 rounded`}
              >
                {post.Published ? "Unpublish 🔒" : "Publish 🚀"}
              </button>

              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
