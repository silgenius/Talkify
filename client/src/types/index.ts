type UserType = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  last_login: Date;
  profile_url: string;
  created_at: Date;
  updated_at: Date;
};

type ConversationType = {
  id: string;
  name: string;
  last_message_id: string;
  group: boolean;
  create_at: string;
  updated_at: string;
  others: [{ id: string; username: string; profile_url: string, last_login: string}];
  users: [{ id: string; username: string; profile_url: string, last_login: string}];
};

type MessageType = {
  id: string;
  message_text: string;
  message_type: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
};

export type { UserType, ConversationType, MessageType };
