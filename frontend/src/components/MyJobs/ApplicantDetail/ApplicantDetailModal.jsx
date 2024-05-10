import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "../ApplicantDetail/styles.module.css";

function ApplicantDetailModal({ applicant, show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>
          Application Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {applicant && (
          <>
            <p className={styles.detail}>First Name: {applicant.firstName}</p>
            <p className={styles.detail}>Last Name: {applicant.lastName}</p>
            {applicant.coverLetter && (
              <p className={styles.detail}>
                Cover Letter: {applicant.coverLetter}
              </p>
            )}
            <p className={styles.detail}>Status: {applicant.status}</p>
            <p className={styles.detail}>
              Submission Date:{" "}
              {new Date(applicant.submissionDate).toLocaleDateString()}
            </p>
            <a href={`/get-cv/${applicant.cvId}`} className={styles.cvLink}>
              View CV
            </a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button
          variant="secondary"
          onClick={onClose}
          className={styles.closeButton}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ApplicantDetailModal;
