import React, { useState } from "react";
import styles from "../Account/styles.module.css";
import localStorageUtils from "../../utils/localStorageUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function Account() {
  const [profilePic, setProfilePic] = useState(null);

  const user = localStorageUtils.getLocalStorageUser();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setProfilePic(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profilePage}>
        <div className={styles.profileHeader}>
          <div className={styles.profilePicContainer}>
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className={styles.profilePic}
              />
            ) : (
              <div className={styles.noPic}>
                <i className="fas fa-user-circle"></i>
              </div>
            )}
            <div className={styles.profileActions}>
              <label htmlFor="upload" className={styles.uploadBtn}>
                <FontAwesomeIcon icon={faPenToSquare} />
                <input
                  type="file"
                  id="upload"
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>
              {profilePic && (
                <button className={styles.removeBtn} onClick={handleRemove}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.profileBody}>
          <h2 className={styles.username}>{user.username}</h2>
          <p className={styles.userInfo}>
            <i className="fas fa-envelope"></i>
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account;
