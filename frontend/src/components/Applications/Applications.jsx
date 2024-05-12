import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import styles from "../Applications/styles.module.css";
import jobAppService from "../../services/jobAppService";
import localStorageUtils from "../../utils/localStorageUtils";
import DeleteModal from "../ConfirmDelete/DeleteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);

  useEffect(() => {
    async function fetchJobApplications() {
      try {
        const userId = localStorageUtils.getLocalUserId();
        const response = await jobAppService.getMyJobApps(userId);
        if (response.status === 200) {
          const formattedApps = response.data.map((app) => ({
            ...app,
            submissionDate: formatDate(app.submissionDate),
          }));
          setApplications(formattedApps);
          console.log(applications)
        } else {
          console.error(
            "Failed to fetch job applications:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    }
    fetchJobApplications();
  }, []);

  const openDeleteModal = (jobAppId) => {
    setCurrentAppId(jobAppId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentAppId(null);
  };

  const openViewModal = (app) => {
    setCurrentApp(app);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setCurrentApp(null);
  };

  const handleDelete = async () => {
    if (currentAppId) {
      const userId = localStorageUtils.getLocalUserId();
      try {
        await jobAppService.deleteJobApp(currentAppId, userId);
        setApplications(
          applications.filter((app) => app._id !== currentAppId)
        );
        toast.success("Application deleted successfully!");
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting job application:", error);
        toast.error("Failed to delete application.");
      }
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <>
      <ToastContainer />
      <div className={`container mt-5 ${styles.container}`}>
        <h2 className={styles.heading}>
          <span className={styles.beeIcon}>🐝</span> Applications
        </h2>
        <Table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Job Title</th>
              <th>Hirer Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {applications.map((app, index) => (
              <tr key={index} className={styles.row}>
                <td>{app.jobId.title}</td>
                <td>{`${app.jobId.postedBy.username}`}</td>
                <td>{app.status}</td>
                <td>{app.submissionDate}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    className={styles.btnView}
                    onClick={() => openViewModal(app)}
                  >
                    View
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    className={styles.btnDelete}
                    onClick={() => openDeleteModal(app._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <DeleteModal
          isOpen={showDeleteModal}
          onCancel={closeDeleteModal}
          onConfirm={handleDelete}
        />
        <Modal
          show={showViewModal}
          onHide={closeViewModal}
          centered
          className={styles.viewModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentApp && (
              <div>
                <p>
                  <strong>Job Title:</strong> {currentApp.jobId.title}
                </p>
                <p>
                  <strong>Job Description:</strong>{" "}
                  {currentApp.jobId.description}
                </p>
                <p>
                  <strong>Hirer Name:</strong>{" "}
                  {currentApp.jobId.postedBy.username}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {currentApp.status}
                </p>
                <p>
                  <strong>Shortlisted:</strong>{" "}
                  {currentApp.shortlisted ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Cover Letter:</strong> {currentApp.coverLetter}
                </p>
                <a href={`/get-cv/${currentApp.cvId._id}`}>View CV</a>
                <p>
                  <strong>Submission Date:</strong> {currentApp.submissionDate}
                </p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default Applications;