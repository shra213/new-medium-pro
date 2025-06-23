import { title } from "framer-motion/client";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { blogsUrl } from "../config";
import axios from "axios";
export interface BlogsType {
  id?: string;
  name?: string;
  author?: {
    name: string;
  };
  title: string;
  date?: Date;
  content: string;
}

export function Circle({
  name,
  size,
}: {
  name: BlogsType["name"] | null;
  size: "small" | "large";
}) {
  return (
    <>
      <div
        className={`flex justify-center items-center rounded rounded-full bg-gray-600 ${
          size === "small" ? " p-3" : "p-4"
        } h-4 w-4 text-slate-100`}
      >
        {name?.[0]}
      </div>
    </>
  );
}

export function Avtar({ name }: Pick<BlogsType, "name">) {
  return <div className="text-[#242424]">{name}</div>;
}

export function BlogCard({ name, title, content, date }: BlogsType) {
  return (
    <>
      <div className="flex justify-around p-1 w-full mx-auto ">
        <div className="md:w-[50%] w-[80%] border-b p-4 border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            {/* Avatar and name row */}
            <div className="flex items-center gap-2">
              <Circle name={name} size="small" />
              <Avtar name={name} />
            </div>

            {/* Date shown below name on mobile, inline on sm+ */}
            <div className="text-sm text-gray-500 sm:ml-2">
              <div className="sm:hidden mt-1 mb-0.5">
                {" "}
                {/* only visible on mobile */}
                {date
                  ? new Date(date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "02 Sep 2025"}
              </div>
              <div className="hidden sm:block">
                {" "}
                {/* only visible on sm+ */}
                <span className="text-gray-400 px-1">•</span>
                {date
                  ? new Date(date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "02 Sep 2025"}
              </div>
            </div>
          </div>

          <div className="mt-2 min-w-full">
            <div className="w-full font-serif text-2xl text-[#242424] font-bold">
              {title}
            </div>
            <div className="w-full text-[#454545]">{content}</div>
          </div>
          <div className="my-6 text-[#6b6b6b]">
            {(content.length / 100) * 2} minute(s)
          </div>
        </div>
      </div>
    </>
  );
}
