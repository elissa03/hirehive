// JobUploadModal.jsx
import React, { useState } from "react";
import styles from "../JobUpload/styles.module.css"

const JobUploadModal = ({ show, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState([]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <h2>Upload New Job</h2>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {/* Add inputs for other job properties as needed */}
          <button type="submit">Upload Job</button>
        </form>
      </div>
    </div>
  );
};

export default JobUploadModal;
