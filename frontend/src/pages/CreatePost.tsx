import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Appbar } from "../components/Appbar";

export default function CreatePost() {
  const location = useLocation();

  const { id, prevtitle, prevcontent } = location.state || {};

  const [publish, setpublish] = useState(false);
  const [title, setTitle] = useState(prevtitle);
  const [content, setContent] = useState(prevcontent);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    console.log(title, content);
  }, []);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      contentRef.current?.focus();
    }
  };

  return (
    <div>
      <Appbar id={id} title={title} content={content} setpublish={setpublish} />
      <div className="px-4 sm:px-6 md:px-0 w-full max-w-4xl mx-auto mt-12  text-gray-800">
        {/* Title Input */}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          placeholder="Title"
          className="w-full text-3xl sm:text-4xl font-serif font-semibold text-gray-700 placeholder-gray-400 outline-none mb-6"
        />

        {/* Content Textarea */}
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story..."
          rows={10}
          className="w-full text-base sm:text-lg font-sans text-gray-700 placeholder-gray-400 outline-none resize-none"
        />
      </div>
      {publish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm px-4">
          <div className="bg-white shadow-md px-5 py-4 rounded-xl border-l-4 border-green-600 text-green-700 flex items-center gap-3 w-fit sm:px-6 sm:py-4">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm sm:text-base md:text-3xl font-medium text-center whitespace-nowrap">
              Your story has been saved!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
