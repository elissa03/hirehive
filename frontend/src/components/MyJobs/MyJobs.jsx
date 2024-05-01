import React, { useEffect, useState } from "react";
import jobService from "../../services/jobService";
import localStorageUtils from "../../utils/localStorageUtils";
import JobUploadModal from "./JobUpload/JobUploadModal";
import JobCards from "./JobCards/JobCards";
import styles from "./styles.module.css"
import { FaPlus } from "react-icons/fa";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const fetchJobs = async () => {
    try {
      const user = localStorageUtils.getLocalStorageUser();
      const userId = user._id;
      if (!userId) {
        console.log("User ID is not available.");
        return;
      }

      const response = await jobService.getMyJobs(userId);
      const jobsArray = Object.values(response.data);
      setJobs(jobsArray);
    } catch (error) {
      console.error("There was an error fetching the jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);


  const addJob = (newJob) => {
    setJobs(...jobs, newJob);
    fetchJobs()
  }

  return (
    <div>
      <h2>My Jobs</h2>
      {jobs.length > 0 ? (
        <JobCards initialJobsData={jobs} />
      ) : (
        <p>You have not posted any jobs.</p>
      )}

      <div className="d-flex justify-content-center col-12 mb-4">
        <button
          className={`btn fab ${styles.bottomRightButton}`}
          onClick={toggleModal}
        >
          <FaPlus />
        </button>
        {isModalOpen && (
          <div className={styles.modalBackdrop}>
            <JobUploadModal
              isOpen={isModalOpen}
              onClose={toggleModal}
              addJob={addJob}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJobs;
