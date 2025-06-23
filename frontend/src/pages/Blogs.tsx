import { Link } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../Hooks/blogs";
import { BlogCardSkeleton } from "../components/BlogCardSkeleton";
export default function Blogs() {
  const { loading, blogs } = useBlogs();
  if (loading) {
    return (
      <>
        <div className="flex flex-col h-screen">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </>
    );
  }
  return (
    <>
      <div>
        {/* <Appbar /> */}
        {blogs.map((blog, index) => (
          <Link to={`/blog/${blog.id}`}>
            <BlogCard
              key={index}
              //@ts-ignore
              name={blog.author.name}
              title={blog.title}
              content={blog.content}
              //@ts-ignore
              date={blog.date}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
