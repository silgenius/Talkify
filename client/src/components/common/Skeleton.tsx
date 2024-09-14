import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-5 p-3 border-l-[5px] border-b border-[#e8e2e2]">
      <div className="w-11.25 h-11.25 bg-gray-300 rounded-full animate-pulse"></div>
      <div className="flex flex-col gap-1 w-full">
        <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
        <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
    </div>
  );
};

export default Skeleton;
