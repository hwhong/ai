"use client";
import React, { useEffect, useState } from "react";
import styles from "./conversation.module.css";
import { IconButton, TextField } from "@mui/material";
import classNames from "classnames";
import { useChat } from "ai/react";
import SendIcon from "@mui/icons-material/Send";
import MicroPhone from "@mui/icons-material/KeyboardVoice";

export function Conversation() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/ai-respond",
  });
  const [isSpeechOn, setIsSpeechOn] = useState<boolean>(false);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  useEffect(() => {
    const validate = async () => {
      const result = await fetch("api/validate-response", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });
    };

    if (messages.length > 1 && messages[messages.length - 1].role === "user") {
      validate();
    }
  }, [messages]);

  useEffect(() => {
    recognition.onresult = (result: any) => {
      const transcript = result.results[0][0].transcript;
      handleInputChange({ target: { value: transcript } } as any);
    };
  });

  const speechToText = () => {
    if (!isSpeechOn) {
      recognition.start();
      setIsSpeechOn(true);
    } else {
      recognition.stop();
      setIsSpeechOn(false);
    }
  };

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
            <IconButton
              color={isSpeechOn ? "primary" : "default"}
              className={styles.sendButton}
              onClick={speechToText}
            >
              <MicroPhone />
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  );
}
