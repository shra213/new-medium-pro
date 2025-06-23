export function BlogCardSkeleton() {
  return (
    <div className="flex justify-center p-1">
      <div className="md:w-[50%] border-b p-4 border-gray-100 animate-pulse">
        {/* Header: Circle + Name + Dot + Date */}
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full bg-gray-300 h-8 w-8" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="text-gray-400 px-1">•</div>
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2" />

        {/* Content lines */}
        <div className="h-4 w-full bg-gray-200 rounded mb-1" />
        <div className="h-4 w-[90%] bg-gray-200 rounded mb-1" />
        <div className="h-4 w-[85%] bg-gray-200 rounded mb-1" />

        {/* Reading time */}
        <div className="mt-4 h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function BlogSkeleton() {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="pl-6 md:pl-0 grid grid-cols-1 md:grid-cols-12 w-[90%] md:max-w-[70%] animate-pulse">
        {/* Author (Mobile First) */}
        <div className="order-1 md:order-2 md:col-span-4">
          <div className="text-gray-300 font-sm font-semibold mb-2">Author</div>
          <div className="flex items-center gap-3.5 my-1.5">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="w-36 h-5 bg-gray-300 rounded"></div>
              <div className="hidden md:block w-48 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Title + Content */}
        <div className="order-2 md:order-1 mt-7 md:mt-0 md:col-span-8">
          <div className="space-y-4">
            <div className="w-3/4 h-10 md:h-16 bg-gray-300 rounded"></div>
            <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
