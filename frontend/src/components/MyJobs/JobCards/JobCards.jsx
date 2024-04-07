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
import jobService from "../../../services/jobService"
import localStorageUtils from "../../../utils/localStorageUtils";

function JobCards({ jobs }) {
  const [activeMenuJobId, setActiveMenuJobId] = useState(null);
  const [editModeJobId, setEditModeJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleMenu = (jobId) => {
    setActiveMenuJobId(activeMenuJobId === jobId ? null : jobId);
  };

  const toggleEditMode = (jobId) => {
    if (editModeJobId === jobId) {
      setEditModeJobId(null);
      setEditedJob({});
    } else {
      setEditModeJobId(jobId);
      const jobToEdit = jobs.find((job) => job._id === jobId);
      setEditedJob({ ...jobToEdit });
    }
  };

  const handleChange = (e, field) => {
    setEditedJob({ ...editedJob, [field]: e.target.value });
  };

  const handleRequirementsChange = (e, index) => {
    const newRequirements = [...editedJob.requirements];
    newRequirements[index] = e.target.value;
    setEditedJob({ ...editedJob, requirements: newRequirements });
  };

  const addRequirement = () => {
    const updatedRequirements = [...editedJob.requirements, ""];
    setEditedJob({ ...editedJob, requirements: updatedRequirements });
  };

  const removeRequirement = (index) => {
    const updatedRequirements = editedJob.requirements.filter(
      (_, reqIndex) => reqIndex !== index
    );
    setEditedJob({ ...editedJob, requirements: updatedRequirements });
  };

  const saveChanges = async () => {
    try {
       const { _id, createdAt, updatedAt, ...updateDetails } = editedJob;
       const user = localStorageUtils.getLocalStorageUser();
       const userId = user._id;

        const response = await jobService.updateJob(_id, {
          newData: updateDetails,
          userId: userId,
        });

       if (response.status === 200) {
         alert("Job updated successfully");
         const updatedJobs = jobs.map((job) => {
           if (job._id === _id) {
             return { ...job, ...updateDetails };
           }
           return job;
         });
         setJobs(updatedJobs); 
         toggleEditMode(null);
       } else {
         alert(`Failed to update job: ${response.data.message}`);
       }

    } catch (error) {
      console.error("Failed to save job details", error);
    }
  };

  return (
    <div className={styles.jobCardsContainer}>
      {jobs.map((job) => (
        <div key={job._id} className={styles.jobCard}>
          <div className={styles.cardHeader}>
            {editModeJobId === job._id ? (
              <input
                type="text"
                value={editedJob.title}
                onChange={(e) => handleChange(e, "title")}
                className={styles.editInput}
              />
            ) : (
              <h3>{job.title}</h3>
            )}
            <FaEllipsisV
              className={styles.menuIcon}
              onClick={() => toggleMenu(job._id)}
            />
          </div>
          {activeMenuJobId === job._id && (
            <div className={styles.cardMenu}>
              <button onClick={() => toggleEditMode(job._id)}>Edit</button>
              <button onClick={() => console.log("Deleting job", job._id)}>
                Delete
              </button>
            </div>
          )}
          {editModeJobId === job._id ? (
            <>
              <textarea
                value={editedJob.description}
                onChange={(e) => handleChange(e, "description")}
              />
              {editedJob.requirements.map((requirement, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementsChange(e, index)}
                  />
                  <button
                    onClick={() => removeRequirement(index)}
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                onClick={addRequirement}
              >
                <FaPlus /> Add Requirement
              </button>
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
            </>
          )}
          <div>
            <FaRegClock /> Posted on {formatDate(job.createdAt)}
          </div>
          {editModeJobId === job._id && (
            <div>
              <button onClick={saveChanges}>
                <FaSave /> Save
              </button>
              <button
                onClick={() => toggleEditMode(job._id)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default JobCards;
