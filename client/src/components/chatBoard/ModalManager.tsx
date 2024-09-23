import React from "react";
import { AiOutlineStop, AiOutlineLogout } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import Modal from "../common/Modal";
import { CgUnblock } from "react-icons/cg";

type ModalManagerProps = {
  showModal: { block?: boolean; unblock?: boolean; exit?: boolean };
  onClose: () => void;
  onAction: () => void;
  isLoading: boolean;
};

const ModalManager: React.FC<ModalManagerProps> = ({
  showModal,
  onClose,
  onAction,
  isLoading,
}) => {
  return (
    <>
      {/* Block Modal */}
      <Modal isOpen={!!showModal?.block} onClose={onClose} height="fit">
        <div className="p-6 text-center">
          <AiOutlineStop className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Block User</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to block this user? They will no longer be
            able to message you.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2 text-lg" />{" "}
                  Blocking...
                </span>
              ) : (
                "Block"
              )}
            </button>
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Unblock Modal */}
      <Modal isOpen={!!showModal?.unblock} onClose={onClose} height="fit">
        <div className="p-6 text-center">
          <CgUnblock className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unblock User</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to unblock this user? They will be able to
            message you again.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2 text-lg" />{" "}
                  Unblocking...
                </span>
              ) : (
                "Unblock"
              )}
            </button>
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Exit Modal */}
      <Modal isOpen={!!showModal?.exit} onClose={onClose} height="fit">
        <div className="p-6 text-center">
          <AiOutlineLogout className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Exit Group</h2>
          <p className="text-gray-600 mb-6">
          Are you sure you want to leave this group? You will no longer receive messages or updates from the group.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className={`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2 text-lg" /> Exiting...
                </span>
              ) : (
                "Exit Group"
              )}
            </button>
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalManager;
