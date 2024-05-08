import React, { useState, useEffect } from "react";
import styles from "../ExploreCards/styles.module.css";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import userService from "../../../services/userService";
import jobAppService from "../../../services/jobAppService";
import CVsPanel from "../../CVsPanel/CVsPanel";
import localStorageUtils from "../../../utils/localStorageUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExploreCards({ jobs }) {
  const [userNames, setUserNames] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showCVsPanel, setShowCVsPanel] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  function formatDate(dateString) {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    return `${formattedDate} at ${formattedTime}`;
  }

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedJob(null);
    setSelectedCV(null);
    setFirstName("");
    setLastName("");
    setCoverLetter("");
  };

  const handleCVSelect = (cvId) => {
    setSelectedCV(cvId);
    setShowCVsPanel(false);
  };

  useEffect(() => {
    const fetchUserName = async (userId) => {
      const response = await userService.getUserById(userId);
      return response.data.username;
    };
    jobs.forEach(async (job) => {
      if (!userNames[job.postedBy]) {
        const username = await fetchUserName(job.postedBy);
        setUserNames((prevUserNames) => ({
          ...prevUserNames,
          [job.postedBy]: username,
        }));
      }
    });
  }, [jobs]);

  const handleSubmit = async () => {
    if (!selectedCV || !firstName || !lastName) {
      toast.error("Please fill all fields", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    const userId = localStorageUtils.getLocalUserId();
    try {
      const applicationData = {
        firstName,
        lastName,
        userId,
        jobId: selectedJob._id,
        cvId: selectedCV,
        coverLetter: selectedJob.isCoverLetterNeeded ? coverLetter : "",
      };
      const response = await jobAppService.createApplication(
        selectedJob._id,
        applicationData
      );
      toast.success("Application successful", {
        position: "top-right",
        autoClose: 2000,
      });
      handleClose();
      console.log("Application successful:", response);
    } catch (error) {
      toast.error("Failed to apply to job", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className={styles.container}>
        {jobs.map((job, index) => (
          <div key={index} className={`card my-3 ${styles.card}`}>
            <div className={`card-body ${styles.cardBody}`}>
              <div>
                <h5 className={`card-title ${styles.cardTitle}`}>
                  {job.title}
                </h5>
                <h6
                  className={`card-subtitle mb-2 text-muted ${styles.cardSubtitle}`}
                >
                  {job.type}
                </h6>
                <p className={`card-text ${styles.cardText}`}>
                  {job.description}
                </p>
                {job.requirements && (
                  <div>
                    <h6>Requirements:</h6>
                    <ul className="list-group list-group-flush">
                      {job.requirements.map((requirement, idx) => (
                        <li
                          key={idx}
                          className={`list-group-item ${styles.listGroupItem}`}
                        >
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p>Posted on: {formatDate(job.createdAt)}</p>
                <p>Deadline: {formatDate(job.deadline)}</p>
                <p>Posted by: {userNames[job.postedBy] || "Loading..."}</p>
              </div>
              <Button
                variant="warning"
                className={`mt-3 ${styles.btnApply}`}
                onClick={() => handleApplyClick(job)}
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Apply for {selectedJob ? selectedJob.title : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide your first name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formLastName" className="mt-3">
                <Form.Label>Last Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide your last name.
                </Form.Control.Feedback>
              </Form.Group>
              <div className={styles.buttonWrapper}>
                <Button
                  variant="warning"
                  className="mt-3"
                  onClick={() => setShowCVsPanel(true)}
                >
                  Choose a CV
                </Button>
              </div>
              {selectedCV && <p className="mt-2">Selected CV: {selectedCV}</p>}
              {selectedJob && selectedJob.isCoverLetterNeeded && (
                <Form.Group controlId="formCoverLetter" className="mt-3">
                  <Form.Label>Cover Letter*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your cover letter here"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your cover letter.
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              <Button
                variant="warning"
                className="mt-3"
                onClick={handleSubmit}
                disabled={!selectedCV || !firstName || !lastName}
              >
                Submit Application
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {showCVsPanel && (
          <div className={styles.cvsPanelOverlay}>
            <CVsPanel
              onSelect={handleCVSelect}
              onClose={() => setShowCVsPanel(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreCards;
