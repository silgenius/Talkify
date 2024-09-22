import { useState } from "react";
import SearchInput from "../../common/SearchInput";
import useAuth from "../../../hooks/useAuth";
import Notifications from "./Notifications";
import Privacy from "./Privacy";
import Profile from "./Profile";
import { FaBell, FaUser } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
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
            className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center ${
              activeTab === "profile" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUser className="inline-block mr-2" />
            <p>Profile</p>
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center ${
              activeTab === "notifications"
                ? tabcolors.acitve
                : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell className="inline-block mr-2" />
            <p>Notifications</p>
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors flex items-center justify-center ${
              activeTab === "privacy" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            <FaShield className="inline-block mr-2" />
            <p>Privacy</p>
          </button>
        </nav>
        {/* Main Content */}

        <div className="flex-1 px-4 py-4 mb-4 overflow-auto bg-white rounded-lg shadow-lg">
          {activeTab === "profile" && (
            <Profile handleLogout={handleLogout}/>
          )}

          {activeTab === "notifications" && (
            <Notifications />
          )}

          {activeTab === "privacy" && (
            <Privacy toggleOptions={toggleOptions} expandedOption={expandedOption}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
