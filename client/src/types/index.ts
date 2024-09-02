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
export interface SettingType {
  id: number; // Unique identifier for the setting
  name: string; // Name of the setting
  description: string; // Description or additional details about the setting
  value: string | number | boolean; // The value of the setting, assuming it can be a string, number, or boolean
}
export type { UserType, ConversationType, MessageType };
