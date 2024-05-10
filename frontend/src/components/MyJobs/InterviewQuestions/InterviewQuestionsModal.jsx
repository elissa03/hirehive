import React, { useState, useEffect } from "react";
import styles from "../InterviewQuestions/styles.module.css";

const InterviewQuestionsModal = ({ questions, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questions.length > 0) {
      setLoading(false);
    }
  }, [questions]);

  return (
    <div className={styles.modalBackground} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Interview Questions</h2>
        {loading ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          <div className={styles.questionsContainer}>
            {questions.map((question, index) => (
              <div key={index} className={styles.questionItem}>
                <p>{question}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionsModal;
