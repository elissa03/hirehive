import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import jobService from "../../services/jobService";
import localStorageUtils from "../../utils/localStorageUtils";
import ExploreCards from "./ExploreCards/ExploreCards";
import { TailSpin } from "react-loader-spinner";

function ExploreJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const user = localStorageUtils.getLocalStorageUser();
      const userId = user._id;
      if (!userId) {
        console.log("User ID is not available.");
        return;
      }
      const response = await jobService.getAllJobs(userId);
      setJobs(response.data);
    } catch (error) {
      console.error("There was an error fetching the jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs().then(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Explore Jobs</h2>
      {loading ? (
        <div className={styles.centeredLoader}>
          <TailSpin color="#fbf07de1" height={70} width={70} />
        </div>
      ) : jobs.length > 0 ? (
        <ExploreCards jobs={jobs} />
      ) : (
        <p>There are no jobs posted</p>
      )}
    </div>
  );
}

export default ExploreJobs;
