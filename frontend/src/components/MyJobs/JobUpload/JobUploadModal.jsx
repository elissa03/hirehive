import React, { useState } from "react";
import styles from "../JobUpload/styles.module.css";
import { FaPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import {
  handleChange,
  handleRequirementChange,
  addRequirement,
  handleSubmit,
} from "./utils";

const JobUploadModal = ({ isOpen, onClose, addJob }) => {
  const [formData, setFormData] = useState({
    deadline: "",
    description: "",
    isCoverLetterNeeded: false,
    postedBy: "",
    requirements: [],
    title: "",
  });

  if (!isOpen) return null;
  return (
    <>
      <ToastContainer position="bottom-right" style={{ zIndex: 9999 }} />
      <div className={`modal-backdrop ${styles.modalBackground}`}>
        <div className={`modal-dialog ${styles.modalContainer}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Job Details</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
                style={{ marginLeft: "auto" }}
              ></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) =>
                  handleSubmit(e, formData, setFormData, onClose, addJob)
                }
              >
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleChange(e, formData, setFormData)}
                  placeholder="Title"
                  className="form-control mb-3"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleChange(e, formData, setFormData)}
                  placeholder="Description"
                  className="form-control mb-3"
                />
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Job Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                    className="form-select"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={(e) => handleChange(e, formData, setFormData)}
                  className="form-control mb-3"
                />
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="isCoverLetterNeeded"
                    checked={formData.isCoverLetterNeeded}
                    onChange={(e) => handleChange(e, formData, setFormData)}
                    className="form-check-input"
                    id="coverLetterCheck"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="coverLetterCheck"
                  >
                    Is Cover Letter Needed?
                  </label>
                </div>
                {formData.requirements.map((requirement, index) => (
                  <input
                    key={index}
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      handleRequirementChange(
                        index,
                        e.target.value,
                        formData,
                        setFormData
                      )
                    }
                    placeholder="Requirement"
                    className="form-control mb-1"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addRequirement(formData, setFormData)}
                  className="btn btn-secondary mb-3"
                >
                  <FaPlus /> Add Requirement
                </button>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobUploadModal;
