"use client";
import React, { useEffect, useState } from "react";
import styles from "./prototype.module.css";
import { IconButton, TextField } from "@mui/material";
import classNames from "classnames";
import { useChat } from "ai/react";
import SendIcon from "@mui/icons-material/Send";

export function PrototypeComponent() {
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
  });

  return (
    <div className={styles.root}>
      <div className={styles.chatRoot}>
        <div className={styles.dialogWrapper}>
          {messages.map(({ role, content }) => {
            const isAssistant = role === "assistant";
            return (
              <div
                key={content}
                className={classNames(styles.msg, {
                  [styles.systemMsg]: isAssistant,
                  [styles.userMsg]: role === "user",
                })}
              >
                {isAssistant ? JSON.parse(content) : content}
              </div>
            );
          })}
        </div>
        <div className={styles.bottomRow}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <TextField
                hiddenLabel
                onChange={handleInputChange}
                value={input}
                fullWidth
                variant="filled"
                size="small"
                InputProps={{ disableUnderline: true, className: styles.input }}
              />
            </label>
            <IconButton type="submit" className={styles.sendButton}>
              <SendIcon />
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  );
}
