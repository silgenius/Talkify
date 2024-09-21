import { useState } from "react";
import SearchInput from "../../common/SearchInput";
import { FaUser, FaKey, FaBell } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import useAuth from "../../../hooks/useAuth";
import { FaShield } from "react-icons/fa6";
const Settings = () => {
  const [activeTab, setActiveTab] = useState("Account");
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const toggleOptions = (option: typeof expandedOption) => {
    setExpandedOption(expandedOption === option ? null : option);
  };

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const tabcolors = {
    acitve: "text-primary-purple bg-primary-purple/20",
    inactive: "text-gray-500 bg-white",
  };

  return (
    <div className="flex flex-col h-full py-2">
      <header className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
      </header>
      <div className="px-4">
        <SearchInput value="" onInputChange={() => {}} />
      </div>
      <div className="flex-1 overflow-y-auto h-full px-4">
        <nav className="mb-4 flex gap-4 text-nowrap overflow-x-auto">
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "Account" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("Account")}
          >
            Account
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "notifications"
                ? tabcolors.acitve
                : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "privacy" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
        </nav>
        {/* Main Content */}

        <div className="flex-1 px-4 py-4 mb-4 overflow-auto bg-white rounded-lg shadow-lg">
          {activeTab === "Account" && (
            <div>
              <div className="flex items-center justify-start space-x-4 text-gray-800 mb-8">
                <FaUser className="inline-block text-xl" />
                <h3 className="text-2xl font-semibold">Account Settings</h3>
              </div>
              <div>
                <label className="block text-lg font-medium text-primary-purple mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Julie Li"
                  className="w-full p-3 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple"
                />

                <label className="block text-lg font-medium text-primary-purple mb-2">
                  Bio
                </label>
                <textarea
                  placeholder="Write about yourself"
                  className="w-full p-3 mb-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-purple"
                />
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

              <div className="mt-4 space-y-4">
                <button className="w-full bg-primary-purple text-white font-semibold p-3 rounded-lg hover:bg-primary-purple-dark transition">
                  Save Changes
                </button>
                <button
                  className="w-full bg-gray-500 text-white font-semibold p-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <IoLogOutOutline className="mr-2 text-2xl" /> Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <div className="flex items-center justify-start space-x-4 text-gray-800 mb-8">
                <FaBell className="inline-block text-xl" />
                <h3 className="text-2xl font-semibold">
                  Notification Settings
                </h3>
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
          )}

          {activeTab === "privacy" && (
            <div>
              <div className="flex items-center justify-start space-x-4 text-gray-800 mb-8">
                <FaShield className="inline-block text-xl" />
                <h3 className="text-2xl font-semibold">Privacy Settings</h3>
              </div>
              <div>
                <div className="mb-6">
                  <button
                    className="w-full flex justify-between items-center bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => toggleOptions("lastSeen")}
                  >
                    {expandedOption === "lastSeen"
                      ? "Last seen & Online Options"
                      : "View Last Seen & Online"}
                  </button>
                  {expandedOption === "lastSeen" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                      <p className="mb-4 text-gray-600">
                        Last Seen & Online: Choose visibility
                      </p>
                      <label className="block mb-2">
                        <input type="radio" name="lastSeen" /> Everyone
                      </label>
                      <label className="block mb-2">
                        <input type="radio" name="lastSeen" /> My Contacts
                      </label>
                      <label className="block">
                        <input type="radio" name="lastSeen" /> Nobody
                      </label>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <button
                    className="w-full flex justify-between items-center bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => toggleOptions("profilePhoto")}
                  >
                    {expandedOption === "profilePhoto"
                      ? "Profile Photo Options"
                      : "View Profile Photo"}
                  </button>
                  {expandedOption === "profilePhoto" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                      <p className="mb-4 text-gray-600">
                        Profile Photo: Choose visibility
                      </p>
                      <label className="block mb-2">
                        <input type="radio" name="profilePhoto" /> Everyone
                      </label>
                      <label className="block mb-2">
                        <input type="radio" name="profilePhoto" /> My Contacts
                      </label>
                      <label className="block">
                        <input type="radio" name="profilePhoto" /> Nobody
                      </label>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <button
                    className="w-full flex justify-between items-center bg-gray-200 p-4 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => toggleOptions("blockedContacts")}
                  >
                    {expandedOption === "blockedContacts"
                      ? "Blocked Contacts"
                      : "Blocked Contacts"}
                  </button>
                  {expandedOption === "blockedContacts" && (
                    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
                      <p className="text-gray-600">No blocked contacts.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
