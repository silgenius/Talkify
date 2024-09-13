import { useState } from "react";
import "./settings.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("Account");
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const toggleOptions = (option: typeof expandedOption) => {
    setExpandedOption(expandedOption === option ? null : option);
  };

  const confirmDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      alert("Account deleted.");
    }
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img
            src="./settings.png"
            alt="Settings Icon"
            className="settings-icon"
          />
          <h3>Settings</h3>
        </div>
        <ul>
          <li
            className={activeSection === "Account" ? "active" : ""}
            onClick={() => setActiveSection("Account")}
          >
            Account
          </li>
          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </li>
          <li
            className={activeSection === "privacy" ? "active" : ""}
            onClick={() => setActiveSection("privacy")}
          >
            Privacy
          </li>
        </ul>
      </div>

      <div className="main-content">
        {activeSection === "Account" && (
          <div className="content">
            <h3>Account Settings</h3>
            <div className="input-section">
              <label>Username</label>
              <input type="text" placeholder="Juile Li" />

              <label>Email</label>
              <input type="email" placeholder="Juileli@example.com" />

              <h3>Change Password</h3>
              <label>Current Password</label>
              <input type="password" placeholder="Current Password" />
              <label>New Password</label>
              <input type="password" placeholder="New Password" />
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm New Password" />
              <button className="change-password-button">
                Confirm Change Password
              </button>
            </div>
            <div className="content-section">
              <button
                className="delete-account-button"
                onClick={confirmDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="content">
            <h3>Notification Settings</h3>

            <div className="notification-section">
              <h4 className="notification-title">Message Notifications</h4>
              <div className="notification-item">
                <label className="notification-label">
                  Enable Notifications
                  <div className="switch">
                    <input type="checkbox" id="enable-message-notifications" />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
              <div className="notification-item">
                <label className="notification-label">
                  Enable Sound
                  <div className="switch">
                    <input type="checkbox" id="enable-message-sound" />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
            </div>

            <div className="notification-section">
              <h4 className="notification-title">Group Notifications</h4>
              <div className="notification-item">
                <label className="notification-label">
                  Enable Notifications
                  <div className="switch">
                    <input type="checkbox" id="enable-group-notifications" />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
              <div className="notification-item">
                <label className="notification-label">
                  Enable Sound
                  <div className="switch">
                    <input type="checkbox" id="enable-group-sound" />
                    <span className="slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeSection === "privacy" && (
          <div className="content">
            <h3>Privacy Settings</h3>
            <div className="privacy-options">
              <div className="privacy-option">
                <button
                  className="toggle-button"
                  onClick={() => toggleOptions("lastSeen")}
                >
                  {expandedOption === "lastSeen"
                    ? "Last seen & Online Options"
                    : "View Last Seen & Online"}
                </button>
                {expandedOption === "lastSeen" && (
                  <div className="option-content">
                    <p>Last Seen & Online: Choose visibility</p>
                    <label>
                      <input type="radio" name="lastSeen" /> Everyone
                    </label>
                    <label>
                      <input type="radio" name="lastSeen" /> My Contacts
                    </label>
                    <label>
                      <input type="radio" name="lastSeen" /> Nobody
                    </label>
                  </div>
                )}
              </div>
              <div className="privacy-option">
                <button
                  className="toggle-button"
                  onClick={() => toggleOptions("profilePhoto")}
                >
                  {expandedOption === "profilePhoto"
                    ? "Profile Photo Options"
                    : "View Profile Photo"}
                </button>
                {expandedOption === "profilePhoto" && (
                  <div className="option-content">
                    <p>Profile Photo: Choose visibility</p>
                    <label>
                      <input type="radio" name="profilePhoto" /> Everyone
                    </label>
                    <label>
                      <input type="radio" name="profilePhoto" /> My Contacts
                    </label>
                    <label>
                      <input type="radio" name="profilePhoto" /> Nobody
                    </label>
                  </div>
                )}
              </div>
              <div className="privacy-option">
                <button
                  className="toggle-button"
                  onClick={() => toggleOptions("blockedContacts")}
                >
                  {expandedOption === "blockedContacts"
                    ? "Blocked Contacts"
                    : "Blocked Contacts"}
                </button>
                {expandedOption === "blockedContacts" && (
                  <div className="blocked-contacts">
                    <p>No blocked contacts.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
