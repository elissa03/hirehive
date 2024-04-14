import React, { useState } from "react";
import {
  FaRegClock,
  FaRegListAlt,
  FaRegBuilding,
  FaEllipsisV,
  FaSave,
  FaTimes,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import styles from "../JobCards/styles.module.css";
import {
  formatDate,
  toggleMenu,
  toggleEditMode,
  handleChange,
  handleRequirementsChange,
  addRequirement,
  removeRequirement,
  saveChanges,
  deleteJob,
} from "./utils.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../ConfirmDelete/DeleteModal.jsx";

function JobCards({ initialJobsData }) {
  const [jobs, setJobs] = useState(initialJobsData);
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);
  const [editModeJobId, setEditModeJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Function to open delete modal and set jobToDelete state
  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  // Function to close delete modal
  const closeDeleteModal = () => {
    setJobToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.jobCardsContainer}>
        {jobs.map((job) => (
          <div key={job._id} className={styles.jobCard}>
            <div className={styles.cardHeader}>
              {editModeJobId === job._id ? (
                <input
                  type="text"
                  value={editedJob.title}
                  onChange={(e) =>
                    handleChange(e, "title", editedJob, setEditedJob)
                  }
                  className={styles.editInput}
                />
              ) : (
                <h3>{job.title}</h3>
              )}
              <div className={styles.menuContainer}>
                <FaEllipsisV
                  className={styles.menuIcon}
                  onClick={() =>
                    toggleMenu(job._id, activeMenuJobId, setActiveMenuJobId)
                  }
                />
                {activeMenuJobId === job._id && (
                  <div className={styles.cardMenu}>
                    <button
                      onClick={() =>
                        toggleEditMode(
                          job._id,
                          editModeJobId,
                          setEditModeJobId,
                          setEditedJob,
                          jobs,
                          setActiveMenuJobId
                        )
                      }
                    >
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(job._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            {editModeJobId === job._id ? (
              <>
                <textarea
                  value={editedJob.description}
                  onChange={(e) =>
                    handleChange(e, "description", editedJob, setEditedJob)
                  }
                />
                {editedJob.requirements.map((requirement, index) => (
                  <div key={index} className={styles.requirementField}>
                    <input
                      className={styles.requirementInput}
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleRequirementsChange(
                          e,
                          index,
                          editedJob,
                          setEditedJob
                        )
                      }
                    />
                    <button
                      className={`${styles.button} ${styles.minusButton}`}
                      onClick={() =>
                        removeRequirement(index, editedJob, setEditedJob)
                      }
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  className={`${styles.button} ${styles.addButton}`}
                  onClick={() => addRequirement(editedJob, setEditedJob)}
                >
                  <FaPlus /> Add Requirement
                </button>
                <div>
                  <label>Job Type:</label>
                  <select
                    value={editedJob.type || ""}
                    onChange={(e) =>
                      handleChange(e, "type", editedJob, setEditedJob)
                    }
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label>Deadline:</label>
                  <input
                    type="date"
                    value={editedJob.deadline || ""}
                    onChange={(e) =>
                      handleChange(e, "deadline", editedJob, setEditedJob)
                    }
                  />
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={editedJob.isCoverLetterNeeded || false} // Adjust this line according to how you store this value
                      onChange={(e) =>
                        handleChange(
                          { target: { value: e.target.checked } }, // Make sure the handleChange can handle this structure
                          "isCoverLetterNeeded",
                          editedJob,
                          setEditedJob
                        )
                      }
                    />
                    Cover letter required
                  </label>
                </div>
              </>
            ) : (
              <>
                <h4>
                  <FaRegBuilding /> {job.company}
                </h4>
                <p>{job.description}</p>
                <div>
                  <FaRegListAlt /> Requirements: {job.requirements.join(", ")}
                </div>
                <div>
                  <strong>Type:</strong> {job.type}
                </div>
                <div>
                  <strong>Deadline:</strong> {formatDate(job.deadline)}
                </div>
                <div>
                  <strong>Cover Letter:</strong>{" "}
                  {job.isCoverLetterNeeded ? "Required" : "Not required"}
                </div>
              </>
            )}
            <div>
              <FaRegClock /> Posted on {formatDate(job.createdAt)}
            </div>
            {editModeJobId === job._id && (
              <div>
                <button
                  className={`${styles.button} ${styles.saveButton}`}
                  onClick={() =>
                    saveChanges(
                      editedJob,
                      jobs,
                      setJobs,
                      setEditModeJobId,
                      setEditedJob
                    )
                  }
                >
                  <FaSave /> Save
                </button>
                <button
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={() =>
                    toggleEditMode(
                      job._id,
                      editModeJobId,
                      setEditModeJobId,
                      setEditedJob,
                      jobs
                    )
                  }
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <DeleteModal
        isOpen={showDeleteModal} 
        onCancel={closeDeleteModal}
        onConfirm={() => {
          deleteJob(jobToDelete, jobs, setJobs);
          closeDeleteModal(); 
        }}
      />
    </>
  );
}

export default JobCards;
