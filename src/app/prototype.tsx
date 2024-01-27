"use client";
import React, { useState } from "react";
import styles from "./prototype.module.css";
import { Button, TextField } from "@mui/material";
import classNames from "classnames";
import { useChat } from "ai/react";

enum Role {
  USER,
  SYSTEM,
}

export function PrototypeComponent() {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [currentMsg, setCurrentMsg] = useState<string>("");
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: "api/invoke",
    // onResponse(response) {
    //   const sourcesHeader = response.headers.get("x-sources");
    //   const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
    //   const messageIndexHeader = response.headers.get("x-message-index");
    //   if (sources.length && messageIndexHeader !== null) {
    //     setSourcesForMessages({
    //       ...sourcesForMessages,
    //       [messageIndexHeader]: sources,
    //     });
    //   }
    // },
    // onError: (e) => {
    //   toast(e.message, {
    //     theme: "dark",
    //   });
    // },
  });

  //   const invokeLLM = async () => {
  //     try {
  //       const res = await fetch("api/invoke", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ question: currentMsg }),
  //       });
  //       console.log(res);
  //       const body = res.body;
  //       for await (const chunk of body) {
  //         console.log(chunk);
  //       }

  //       setMessages([...messages]);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  // const onClick = () => invokeLLM();

  return (
    <div className={styles.root}>
      <div className={styles.dialogWrapper}>
        {messages.map(({ role, content }) => {
          return (
            <div
              key={content}
              className={classNames(styles.msg, {
                [styles.systemMsg]: role === "system",
                [styles.userMsg]: role === "user",
              })}
            >
              {content}
            </div>
          );
        })}
      </div>
      <div className={styles.bottomRow}>
        <form onSubmit={handleSubmit}>
          <label>
            <TextField onChange={handleInputChange} value={input} />
          </label>
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
