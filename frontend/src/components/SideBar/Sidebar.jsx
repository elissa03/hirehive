import React, { useState } from "react";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faFileAlt,
  faBriefcase,
  faClipboardList,
  faCog,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ handleLogout, setActiveComponent }) {
  const [active, setActive] = useState("dashboard");

  const handleSetActive = (name) => {
    setActive(name);
    setActiveComponent(name);
  };

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 ${styles.sidebar}`}>
      <p
        className={`d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none ${styles.brand}`}
      >
        HireHive
      </p>
      <hr />
      <p className={styles.labels}>MENU</p>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a
            onClick={() => handleSetActive("dashboard")}
            className={`nav-link ${
              active === "dashboard" ? styles.active : ""
            } ${styles.navLink}`}
            aria-current="page"
          >
            <FontAwesomeIcon icon={faTachometerAlt} className={styles.icon} />
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a
            onClick={() => handleSetActive("cvs")}
            className={`nav-link ${active === "cvs" ? styles.active : ""} ${
              styles.navLink
            }`}
            aria-current="page"
          >
            <FontAwesomeIcon icon={faFileAlt} className={styles.icon} /> CVs
          </a>
        </li>
        <li className="nav-item">
          <a
            onClick={() => handleSetActive("jobs")}
            className={`nav-link ${active === "jobs" ? styles.active : ""} ${
              styles.navLink
            }`}
            aria-current="page"
          >
            <FontAwesomeIcon icon={faBriefcase} className={styles.icon} /> Jobs
          </a>
        </li>
        <li className="nav-item">
          <a
            onClick={() => handleSetActive("applications")}
            className={`nav-link ${
              active === "applications" ? styles.active : ""
            } ${styles.navLink}`}
            aria-current="page"
          >
            <FontAwesomeIcon icon={faClipboardList} className={styles.icon} />{" "}
            My Applications
          </a>
        </li>

        <p className={styles.labels}>OTHERS</p>
        <li>
          <a
            onClick={() => handleSetActive("settings")}
            className={`nav-link ${
              active === "settings" ? styles.active : ""
            } ${styles.navLink}`}
          >
            <FontAwesomeIcon icon={faCog} className={styles.icon} /> Settings
          </a>
        </li>
        <li>
          <a
            onClick={() => handleSetActive("account")}
            className={`nav-link ${active === "account" ? styles.active : ""} ${
              styles.navLink
            }`}
          >
            <FontAwesomeIcon icon={faUser} className={styles.icon} /> Account
          </a>
        </li>
        <li>
          <a className={`nav-link ${styles.navLink}`} onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} /> Sign
            Out
          </a>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export default Sidebar;
