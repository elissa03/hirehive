import React, { useState, useEffect, useRef } from "react";
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
import ApplicantsModal from "../Applicants/ApplicantsModal.jsx";

function JobCards({ initialJobsData }) {
  const [jobs, setJobs] = useState(initialJobsData);
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);
  const [editModeJobId, setEditModeJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedApplicantsJobId, setSelectedApplicantsJobId] = useState(null);
  const menuRef = useRef(null);

  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setJobToDelete(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuJobId(null); // Close the menu if click outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  placeholder="Job Title"
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
                  <div ref={menuRef} className={styles.cardMenu}>
                    <button onClick={() => setSelectedApplicantsJobId(job._id)}>
                      View Applicants
                    </button>
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
                  placeholder="Job Description"
                  className={styles.textarea}
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
                      placeholder="Requirement"
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
                  <label className="label">Job Type:</label>
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
                  <label className="label">Deadline:</label>
                  <input
                    type="date"
                    value={editedJob.deadline || ""}
                    onChange={(e) =>
                      handleChange(e, "deadline", editedJob, setEditedJob)
                    }
                  />
                </div>
                <div>
                  <label className="label">
                    <input
                      type="checkbox"
                      checked={editedJob.isCoverLetterNeeded || false}
                      onChange={(e) =>
                        handleChange(
                          { target: { value: e.target.checked } },
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
            {selectedApplicantsJobId === job._id && (
              <ApplicantsModal
                jobId={job._id}
                onClose={() => setSelectedApplicantsJobId(null)}
              />
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
