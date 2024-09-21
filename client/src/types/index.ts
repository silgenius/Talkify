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

type UserMiniDataType = {
  id: string;
  username: string;
  profile_url: string;
  last_login: string;
};

type ConversationType = {
  id: string;
  name: string;
  last_message_id: string;
  group: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  others: {
    id: string;
    username: string;
    profile_url: string;
    last_login: string;
  }[];
  users: {
    id: string;
    username: string;
    profile_url: string;
    last_login: string;
  }[];
};

type MessageType = {
  id: string;
  message_text: string;
  message_type: string;
  sender_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  duration: number
};
export interface SettingType {
  id: number; // Unique identifier for the setting
  name: string; // Name of the setting
  description: string; // Description or additional details about the setting
  value: string | number | boolean; // The value of the setting, assuming it can be a string, number, or boolean
}

type ContactType = {
  contact: {
    id: string;
    username: string;
    last_login: string;
    profile_url: string;
  };
  status: string;
  created_at: string;
};

type ContactAction = {
  sender_id: string;
  receiver_id: string;
};

type CallDataType =
  | {
      dialing: boolean;
      endStatus?: "answered" | "rejected" | "busy" | "unavailable" | "failed" | "missed";
      caller?: { userId: string; peerId?: string };
      callee?: { userId: string; peerId?: string };
      duration?: number;
    }
  | undefined;

export type {
  UserType,
  UserMiniDataType,
  ConversationType,
  MessageType,
  ContactType,
  ContactAction,
  CallDataType,
};
