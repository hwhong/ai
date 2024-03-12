import { Message } from "ai";

export const stringifyConversation = (
  conversation: Message[],
  roleMap: Record<Message["role"], string>
): string => {
  let result = "\n";

  for (const { role, content } of conversation) {
    result += `<${roleMap[role]}>:` + " " + content + "\n";
  }

  return result;
};
