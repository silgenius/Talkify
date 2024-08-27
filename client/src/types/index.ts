type MessageType = {
  id: string;
  message_text: string;
  message_type: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
};

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

export type { UserType, MessageType };
