"use client";
import React, { useState } from "react";
import styles from "./prototype.module.css";
import { Button, TextField } from "@mui/material";
import classNames from "classnames";

enum Role {
  USER,
  SYSTEM,
}

interface Message {
  role: Role;
  content: string;
}

export function PrototypeComponent() {
  const [messages, setMessages] = useState<Message[]>([]);

  //   const invokeLLM = async = () => {
  //     try {
  //         const res = await fetch("api/invoke").
  //     }
  //   }

  return (
    <div className={styles.root}>
      <div className={styles.dialogWrapper}>
        {messages.map(({ role, content }) => {
          return (
            <div
              key={content}
              className={classNames(styles.msg, {
                [styles.systemMsg]: role === Role.SYSTEM,
                [styles.userMsg]: role === Role.USER,
              })}
            >
              {content}
            </div>
          );
        })}
      </div>
      <div className={styles.bottomRow}>
        <TextField />
        <Button>Send</Button>
      </div>
    </div>
  );
}
