import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-purple"></div>
    </div>
  );
};

export default LoadingSpinner;
