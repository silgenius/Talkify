export enum SocketEvent {
    // Triggered when a new connection is established with the server
    CONNECT = 'connect', 

    // Triggered when a client disconnects from the server
    DISCONNECT = 'disconnect',

    // Client sends a message to the server
    SEND_MESSAGE = 'send_message', 

    // Server confirms that the message was successfully sent
    MESSAGE_SENT = 'message_sent',

    // Client notifies the server that the user has started typing
    START_TYPING = 'start_typing', 

    // Server broadcasts to other clients that the user has started typing
    TYPING_STARTED = 'typing_started',

    // Client notifies the server that the user has stopped typing
    STOP_TYPING = 'stop_typing', 

    // Server broadcasts to other clients that the user has stopped typing
    TYPING_STOPPED = 'typing_stopped',

    // Client requests to connect the user
    CONNECT_USER = 'connect_user',

    // Server confirms that the user is connected (online)
    USER_CONNECTED = 'user_connected',

    // Client requests to disconnect the user
    DISCONNECT_USER = 'disconnect_user',

    // Server confirms that the user is disconnected (offline)
    USER_DISCONNECTED = 'user_disconnected',

    // Triggered when an error occurs on the client or server
    ERROR = 'error',
}
