const Settings = () => {
    const { logout } = useAuth();
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <button
          className="mt-4 px-4 py-2 flex bg-gray-300 text-black rounded-lg shadow-lg hover:bg-primary-dark "
          onClick={() => logout()} // Replace with actual logout function
        >
          <img
            src="/logout.png"
            alt="Logout"
            className="w-6 h-6 inline-block mr-2"
          />
  
          <p className="">Log Out</p>
        </button>
      </div>
    );
  };
  
  export default Settings;