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
  const questions: string[] = [
    "How many people are joining the table?",
    "What does the customer want to eat? Choosing between beef and fish",
    "How does the customer want to pay, by card or cash?",
  ];
  const [answers, setAnswers] = useState<boolean[]>([]);
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  useEffect(() => {
    const validate = async () => {
      const result = await fetch("api/validate-response", {
        method: "POST",
        body: JSON.stringify({ messages, questions: questions }),
      });
      const data: boolean[] = await result.json();
      setAnswers(data);
    };

    if (messages.length > 1 && messages[messages.length - 1].role === "user") {
      const result = validate();
      console.log(result);
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
      <div>
        {questions.map((q, i) => (
          <div key={q}>
            <div key={q}>{q}</div>
            <div key={q}>{answers[i] ?? false}</div>
          </div>
        ))}
      </div>
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
