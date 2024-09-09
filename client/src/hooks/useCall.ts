import { useContext } from "react";
import { CallContext } from "../contexts/CallContext";

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  return context;
};
