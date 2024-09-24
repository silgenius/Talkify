import { FaShield } from "react-icons/fa6";

interface PrivacyProps {
  toggleOptions: (option: string) => void;
  expandedOption: string | null;
}

const Privacy = ({toggleOptions, expandedOption}: PrivacyProps) => {

  return (
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
  );
};

export default Privacy;
