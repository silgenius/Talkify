import { FaKey } from "react-icons/fa";

const Password = () => {
  return (
    <div>
      <div className="flex items-center justify-start space-x-4 text-gray-800 mb-8">
        <FaKey className="inline-block text-xl" />
        <h3 className="text-2xl font-semibold ">Change Password</h3>
      </div>
      <label className="block text-lg font-medium text-primary-purple mb-2">
        Current Password
      </label>
      <input
        type="password"
        placeholder="Current Password"
        className="w-full p-3 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple"
      />
      <label className="block text-lg font-medium text-primary-purple mb-2">
        New Password
      </label>
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-3 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple"
      />
      <label className="block text-lg font-medium text-primary-purple mb-2">
        Confirm New Password
      </label>
      <input
        type="password"
        placeholder="Confirm New Password"
        className="w-full p-3 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple"
      />
    </div>
  );
};

export default Password;
