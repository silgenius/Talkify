import { useQuery } from "@tanstack/react-query";
import { useCall } from "../../hooks/useCall";
import socket from "../../socket";
import { CallDataType } from "../../types";
import { getUser } from "../../utils/localStorage";
import ActiveCall from "./voiceCall/ActiveCall";
import CallEnded from "./voiceCall/CallEnded";
import IncomingCall from "./voiceCall/IncomingCall";
import OutgoingCall from "./voiceCall/OutgoingCall";
import newRequest from "../../utils/newRequest";

const VoiceCall = ({
  contactId,
  callData,
  setIsCall,
}: {
  contactId?: string;
  callData: CallDataType;
  setIsCall: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { activeCall } = useCall();
  const userId = getUser().id;

  const { data: contact } = useQuery({
    queryKey: ["user", contactId],
    queryFn: async () => {
      const res = (await newRequest(`user/id/${contactId}`)).data;
      console.log("user", res);
      return res;
    },
  });

  const handleClose = () => {
    setIsCall(false);
  };

  const handleCancel = () => {
    socket.emit("end_call", { ...callData, dialing: false });
    setIsCall(false);
  };
  return (
    <div>
      {callData?.dialing ? (
        callData?.callee?.userId === userId ? (
          <IncomingCall
            contact={contact}
            callData={callData}
            onCallEnd={handleClose}
          />
        ) : (
          <OutgoingCall contact={contact} onCallEnd={handleCancel} />
        )
      ) : !activeCall ? (
        <CallEnded
          onCallEnd={() => setIsCall(false)}
          contact={contact}
          status={callData?.endStatus}
        />
      ) : (
        <ActiveCall contact={contact} onCallEnd={() => activeCall.close()} />
      )}
    </div>
  );
};

export default VoiceCall;
