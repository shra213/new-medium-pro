import { useBlog } from "../Hooks/blogs";
import { useParams } from "react-router-dom";
import { FullBLog } from "../components/FullBlog";
import { BlogSkeleton } from "../components/BlogCardSkeleton";
export default function Blog() {
  const params = useParams<{ id: string }>();
  const id = params.id || "";
  const { loading, blog } = useBlog({ id: id || "" });
  if (loading) {
    return (
      <>
        <div className="">
          <BlogSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <FullBLog blog={blog} />
    </>
  );
}
