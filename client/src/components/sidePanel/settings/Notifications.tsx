import { FaBell } from "react-icons/fa";

const Notifications = () => {
  return (
    <div>
      <div className="flex items-center justify-start space-x-4 text-gray-800 mb-8">
        <FaBell className="inline-block text-xl" />
        <h3 className="text-2xl font-semibold">Notification Settings</h3>
      </div>

      <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h4 className="text-lg font-medium text-primary-purple mb-4 border-b pb-2 border-gray-300">
          Message Notifications
        </h4>
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg">Enable Notifications</label>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 peer transition-all duration-300"
            />
            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 transition-all duration-300 peer-checked:bg-primary-purple"></span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-lg">Enable Sound</label>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 peer transition-all duration-300"
            />
            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 transition-all duration-300 peer-checked:bg-primary-purple"></span>
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
        <h4 className="text-lg font-medium text-primary-purple mb-4 border-b pb-2 border-gray-300">
          Group Notifications
        </h4>
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg">Enable Notifications</label>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 peer transition-all duration-300"
            />
            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 transition-all duration-300 peer-checked:bg-primary-purple"></span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-lg">Enable Sound</label>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 peer transition-all duration-300"
            />
            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 transition-all duration-300 peer-checked:bg-primary-purple"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
