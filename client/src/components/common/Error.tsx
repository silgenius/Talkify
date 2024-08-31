const Error = ({onRetry}: {onRetry: () => void}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold text-red-500">
          Oops! Failed to load conversations.
        </p>
        <p className="text-gray-600 mt-2">
          Please check your connection and try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
      >
        Retry
      </button>
    </div>
  );
};

export default Error;
