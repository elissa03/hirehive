import React from "react";
import styles from "./styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Modal, Button } from "react-bootstrap"; 
import { MdHive } from "react-icons/md";

function DeleteModal({ isOpen, onCancel, onConfirm }) {
  return (
    <Modal show={isOpen} onHide={onCancel} centered>
      <Modal.Header closeButton className={styles.beeHeader}>
        <Modal.Title>
          <MdHive className={styles.beeIcon} /> Confirm Deletion{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.beeBody}>
        <p>Are you sure you want to delete this item?</p>
        <p className={styles.warningText}>
          This action cannot be undone!
        </p>
      </Modal.Body>
      <Modal.Footer className={styles.beeFooter}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="warning" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
