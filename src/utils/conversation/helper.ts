import { Message } from "ai";

// type RoleType = Omit<Message["role"], "data" | "system" | "function" | "tool">;

export const stringifyConversation = (
  conversation: Message[],
  roleMap: Record<string, string>
): string => {
  let result = "\n";

  for (const { role, content } of conversation) {
    result += `<${roleMap[role]}>:` + " " + content + "\n";
  }

  return result;
};
