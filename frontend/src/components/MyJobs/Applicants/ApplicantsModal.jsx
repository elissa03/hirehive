import React, { useEffect, useState, useRef } from "react";
import jobAppService from "../../../services/jobAppService";
import cvService from "../../../services/cvService";
import jobService from "../../../services/jobService";
import styles from "../Applicants/styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import localStorageUtils from "../../../utils/localStorageUtils";
import openAiService from "../../../services/openAiService";
import InterviewQuestionsModal from "../InterviewQuestions/InterviewQuestionsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ApplicantDetailModal from "../ApplicantDetail/ApplicantDetailModal";

function ApplicantsModal({ jobId, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false); 
  const [selectedApplicant, setSelectedApplicant] = useState(null); 
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [showApplicantDetailsModal, setShowApplicantDetailsModal] =
    useState(false);
  const [selectedApplicantDetails, setSelectedApplicantDetails] =
    useState(null);
  const user = localStorageUtils.getLocalStorageUser();
  const userId = user._id;

  
  useEffect(() => {
    const fetchApplicants = async () => {
      try { 

        const matchingResponse = await jobAppService.getMatchingApps(
          jobId,
          userId
        );
       
        console.log('matchingResponse ', matchingResponse)

        const applicantsWithMatching = matchingResponse.data.map(applicantInfo => {
          console.log('app info ', applicantInfo);
            const match = applicantInfo.matchingPercentage;
            const applicant = applicantInfo.applicant;
            return {
              ...applicant,
              matchingPercentage: match ? match : 'N/A'
            }
        })
 
        console.log(applicantsWithMatching)
        setApplicants(applicantsWithMatching);

      } catch (error) {
        console.error("Error fetching job applicants:", error);
      }
    };

    if (jobId && userId) {
      fetchApplicants();
    }

    
  }, [jobId, userId]);


  const handleGenerateQuestions = async (applicant) => {
    const cvResponse = await cvService.getCv(applicant.cvId, userId);
    const jobResponse = await jobService.getJobDetails(applicant.jobId, userId);

    if (cvResponse.status !== 200 || jobResponse.status !== 200) {
      console.error("Failed to fetch CV or job details");
      return;
    }
    const cvString = JSON.stringify(cvResponse.data);
    const jobString = JSON.stringify(jobResponse.data);

    const questions = await openAiService.generateInterviewQuestions(
      applicant,
      cvString,
      jobString
    );
    setInterviewQuestions(questions);
    
  };
  
  const handleShortlistToggle = async (index) => {
    const applicantToUpdate = applicants[index];
    const updatedShortlistedStatus = !applicantToUpdate.isShortListed;

    setApplicants((prevApplicants) => {
      const updatedApplicants = [...prevApplicants];
      updatedApplicants[index].isShortListed = updatedShortlistedStatus;
      return updatedApplicants;
    });

    try {
      await jobAppService.shortlistApplicant(
        applicantToUpdate._id,
        userId,
        updatedShortlistedStatus
      );
    } catch (error) {
      console.error("Error updating shortlist status:", error);

      setApplicants((prevApplicants) => {
        const revertedApplicants = [...prevApplicants];
        revertedApplicants[index].isShortListed = !updatedShortlistedStatus;
        return revertedApplicants;
      });
    }
  };

  const handleToggleQuestions = async (applicant) => {
    setShowQuestions(!showQuestions);
    setSelectedApplicant(applicant);
    if (!showQuestions) {
      await handleGenerateQuestions(applicant);
    }
  };

  const handleViewApplication = async (applicant) => {
    try {
      console.log(applicant)
      const response = await jobAppService.getJobAppDetails(
        applicant._id,
        userId
      );
      setSelectedApplicantDetails(response.data);
      setShowApplicantDetailsModal(true);
    } catch (error) {
      console.error("Error fetching job application details:", error);
    }
  };

  const handleCloseApplicantDetailsModal = () => {
    setShowApplicantDetailsModal(false);
    setSelectedApplicantDetails(null);
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
              <th style={{ width: "50px" }}>Shortlist</th>
              <th>Submission Date</th>
              <th style={{ width: "50px" }}>Matching Percentage</th>
              <th>Interview Questions</th>
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
                    checked={applicant.isShortListed}
                    onChange={() => handleShortlistToggle(index)}
                  />
                </td>
                <td>
                  {new Date(applicant.submissionDate).toLocaleDateString()}
                </td>
                <td>
                  {applicant.matchingPercentage
                    ? `${applicant.matchingPercentage}%`
                    : "N/A"}
                </td>
                <td>
                  <button
                    className={styles.showQuestionsButton}
                    onClick={() => handleToggleQuestions(applicant)}
                  >
                    {showQuestions && selectedApplicant === applicant
                      ? "Hide Questions"
                      : "Show Questions"}
                  </button>
                </td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewApplication(applicant)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showQuestions && (
          <InterviewQuestionsModal
            questions={interviewQuestions}
            onClose={() => setShowQuestions(false)}
          />
        )}
        <ApplicantDetailModal
          applicant={selectedApplicantDetails}
          show={showApplicantDetailsModal}
          onClose={handleCloseApplicantDetailsModal}
        />
      </div>
    </div>
  );
}

export default ApplicantsModal;