import React, { useEffect, useState } from "react";
import jobService from "../../services/jobService";
import localStorageUtils from "../../utils/localStorageUtils";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = localStorageUtils.getLocalStorageUser();
        const userId = user._id;
        if (!userId) {
          setError("User ID is not available.");
          return;
        }

        const response = await jobService.getMyJobs(userId);
        console.log(response);
      } catch (error) {
        console.error("There was an error fetching the jobs:", error);
      }
    };
    fetchJobs();
  }, []);
  return <div>MyJobs</div>;
}

export default MyJobs;
