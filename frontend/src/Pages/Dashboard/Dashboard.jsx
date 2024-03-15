import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import MainDash from "../../components/MainDash/MainDash";
import Account from "../../components/Account/Account";
import Applications from "../../components/Applications/Applications";
import CVs from "../../components/CVs/CVs";
import Jobs from "../../components/Jobs/Jobs";
import Settings from "../../components/Settings/Settings";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Dashboard({ handleLogout }) {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = () => {
    console.log(activeComponent);
    switch (activeComponent) {
      case "dashboard":
        return <MainDash />;

      case "cvs":
        return <CVs />;

      case "jobs":
        return <Jobs />;

      case "applications":
        return <Applications />;

      case "account":
        return <Account />;

      case "settings":
        return <Settings />;

      default:
        return <MainDash />;
    }
  };
  return (
    <div className={styles.dashboard}>
      <FontAwesomeIcon
        icon={faBars}
        className={styles.burgerIcon}
        onClick={toggleSidebar}
      />
      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <Sidebar
            handleLogout={handleLogout}
            setActiveComponent={setActiveComponent}
          />
        </div>
      )}
      <div className={styles.content}>{renderComponent()}</div>
    </div>
  );
}

export default Dashboard;
