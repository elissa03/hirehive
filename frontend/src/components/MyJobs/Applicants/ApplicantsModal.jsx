import React, { useEffect, useState } from "react";
import jobAppService from "../../../services/jobAppService";
import cvService from "../../../services/cvService";
import jobService from "../../../services/jobService";
import styles from "../Applicants/styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import localStorageUtils from "../../../utils/localStorageUtils";
import openAiService from "../../../services/openAiService";

function ApplicantsModal({ jobId, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const user = localStorageUtils.getLocalStorageUser();
  const userId = user._id;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await jobAppService.getJobApps(jobId, userId);
        console.log("im here", response);
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching job applicants:", error);
      }
    };
    if (jobId && userId) {
      fetchApplicants();
    }
  }, [jobId, userId]);

  const handleGenerateQuestions = async (applicant) => {
    console.log(applicant)
    const cvResponse = cvService.getCv(applicant.cvId);
    const jobResponse = jobService.getJobDetails(applicant.jobId, applicant.userId);

    // if (cvResponse.status !== 200 || jobResponse.status !== 200) {
    //   console.error("Failed to fetch CV or job details");
    //   return;
    // }
    const cvString = JSON.stringify(cvResponse.data);
    const jobString = JSON.stringify(jobResponse.data);

    const questions = await openAiService.generateInterviewQuestions(
      applicant,
      cvString,
      jobString
    );
    console.log("Generated questions:", questions);
    // Display the questions to the user (e.g., in a modal)
  };

  const handleContextMenu = (event, applicant) => {
    event.preventDefault(); // Prevent default right-click behavior

    // Show context menu with "Generate Interview Questions" option
    const menu = document.getElementById("contextMenu");
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.display = "block";

    // Add event listener to "Generate Interview Questions" option
    const generateQuestionsOption = document.getElementById(
      "generateQuestionsOption"
    );
    generateQuestionsOption.onclick = () => {
      handleGenerateQuestions(applicant);
      menu.style.display = "none"; // Hide context menu after clicking
    };
  };

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
              <th>Matching Percentage</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr key={index} onClick={() => handleGenerateQuestions(applicant)}>
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
                <td>95%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApplicantsModal;
