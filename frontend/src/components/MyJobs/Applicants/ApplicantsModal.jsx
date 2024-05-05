import React, { useEffect, useState } from "react";
import jobAppService from "../../../services/jobAppService";
import styles from "../Applicants/styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import localStorageUtils from "../../../utils/localStorageUtils";

function ApplicantsModal({ jobId, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const user = localStorageUtils.getLocalStorageUser();
  const userId = user._id;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await jobAppService.getJobApps(jobId, userId);
        console.log("im here", response)
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching job applicants:", error);
      }
    };
    if (jobId && userId) {
      fetchApplicants();
    }
  }, [jobId, userId]);

  // Toggle shortlisted status for a specific applicant
  const handleShortlistToggle = async (index) => {
    const applicantToUpdate = applicants[index];
    const updatedShortlistedStatus = !applicantToUpdate.isShortListed;

    // Optimistically update the state
    setApplicants((prevApplicants) => {
      const updatedApplicants = [...prevApplicants];
      updatedApplicants[index].isShortListed = updatedShortlistedStatus;
      return updatedApplicants;
    });

    try {
      // Call the API to update the shortlist status
      await jobAppService.shortlistApplicant(
        applicantToUpdate._id,
        userId,
        updatedShortlistedStatus
      );
    } catch (error) {
      console.error("Error updating shortlist status:", error);

      // Revert the optimistic update in case of an error
      setApplicants((prevApplicants) => {
        const revertedApplicants = [...prevApplicants];
        revertedApplicants[index].isShortListed = !updatedShortlistedStatus;
        return revertedApplicants;
      });
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Applicants</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Shortlist Applicant</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr key={index}>
                <td>{applicant.firstName}</td>
                <td>{applicant.lastName}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={applicant.isShortListed} // Ensure this field is used directly for the checkbox
                    onChange={() => handleShortlistToggle(index)} // Toggle shortlist status
                  />
                </td>
                <td>
                  {new Date(applicant.submissionDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicantsModal;
