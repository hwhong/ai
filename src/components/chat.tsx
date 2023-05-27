import React, { useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";
import classNames from "classnames";
import { Message, Person } from "./type";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current as any;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  const onSend = () => {
    const sendToLLM = async () => {
      const newMessages = [...messages];
      newMessages.push({ content: query, person: Person.USER });
      const response = fetch("/api/prompt", {
        method: "POST",
        body: JSON.stringify({ query }),
      });
      const { result }: { result: string[] } = await (await response).json();

      result.forEach((r) =>
        newMessages.push({ content: r, person: Person.AGENT })
      );

      if (result.length === 0) {
        newMessages.push({
          content: `Sorry, I don't have an answer for the question - ${query}`,
          person: Person.AGENT,
        });
      }

      setMessages([...newMessages]);
      setQuery("");
    };
    sendToLLM();
  };

  return (
    <div className={styles.root}>
      <div className={styles.messagesWrapper} ref={containerRef}>
        {messages.map(({ content, person }, i) => (
          <div
            key={content}
            className={classNames(styles.message, {
              [styles.user]: person === Person.USER,
              //   [styles.llm]: i % 2 === 1,
            })}
          >
            {content}
          </div>
        ))}
      </div>
      <div className={styles.toolbar}>
        <input
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={styles.button} onClick={onSend}>
          Send
        </button>
      </div>
    </div>
  );
}
