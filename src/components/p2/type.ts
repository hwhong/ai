export enum Person {
  AGENT = "AGENT",
  USER = "USER",
}

export interface Message {
  content: string;
  person: Person;
}
