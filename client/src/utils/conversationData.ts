import { ConversationType, UserType } from "../types";

export const getChatName = (
  conversation: ConversationType | undefined,
  currentUser: UserType
) => {
  if (!conversation) return;

  if (conversation.group) {
    return conversation.name;
  }

  return conversation.users.filter((user) => user.id !== currentUser.id)[0]
    .username;
};

export const getChatPhoto = (
  conversation: ConversationType | undefined,
  currentUser: UserType
) => {
  if (!conversation) return;
  if (conversation.group) {
    return null;
  }

  return conversation.users.filter((user) => user.id !== currentUser.id)[0]
    .profile_url;
};

export const getChatOthers = (
  conversation: ConversationType | undefined,
  currentUser: UserType
) => {
  if (!conversation) return;
  return conversation.users.filter((user) => user.id !== currentUser.id);
};
