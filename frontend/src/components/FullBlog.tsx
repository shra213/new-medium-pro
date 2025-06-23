import { type BlogsType } from "./BlogCard";
import { Circle } from "./BlogCard";
import { Appbar } from "./Appbar";
export function FullBLog({ blog }: { blog: BlogsType | null }) {
  return (
    <>
      {/* <Appbar /> */}
      <div className="w-full flex justify-center mt-8">
        <div className="pl-6 md:pl-0 grid grid-cols-1 md:grid-cols-12 w-[90%] md:max-w-[70%]">
          <div
            className="order-2 md:order-1 mt-7 md:mt-0
            md:col-span-8 "
          >
            <div>
              <div className="font-serif text-3xl md:text-5xl text-[#242424] font-bold">
                {blog?.title}
              </div>
              <div className=" md:text-lg py-1 text-gray-500">{`posted on ${
                blog?.date
                  ? new Date(blog.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "2 sep 2025"
              }`}</div>
            </div>
            <div className="text-lg mt-3 text-slate-900 ">{blog?.content}</div>
          </div>
          <div className="order-1 md:order-2 md:col-span-4 ">
            <div className=" text-gray-500 font-sm font-semibold">Author</div>
            <div className="flex items-center gap-3.5 my-1.5">
              <div>
                <Circle name={blog?.author?.name} size="large" />
              </div>
              <div>
                <div className=" mb-1 text-slate-950 font-semibold text-xl">
                  {blog?.author?.name || "shraddha chaudhari"}
                </div>
                <div className="text-gray-500 font-sm hidden md:block font-semibold">
                  Writing about code, creativity, and coffee-fueled ideas.
                  Always learning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
