//utils.js
import jobService from "../../../services/jobService";
import localStorageUtils from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const toggleMenu = (jobId, activeMenuJobId, setActiveMenuJobId) => {
  setActiveMenuJobId(activeMenuJobId === jobId ? null : jobId);
};

export const toggleEditMode = (
  jobId,
  editModeJobId,
  setEditModeJobId,
  setEditedJob,
  jobs
) => {
  if (editModeJobId === jobId) {
    setEditModeJobId(null);
    setEditedJob({});
  } else {
    const jobToEdit = jobs.find((job) => job._id === jobId);
    const jobDataForEditing = {
      ...jobToEdit,
      deadline: jobToEdit.deadline ? jobToEdit.deadline.slice(0, 10) : "",
    };
    setEditModeJobId(jobId);
    setEditedJob(jobDataForEditing);
  }
};

export const handleChange = (e, field, editedJob, setEditedJob) => {
  setEditedJob({ ...editedJob, [field]: e.target.value });
};

export const handleRequirementsChange = (e, index, editedJob, setEditedJob) => {
  const newRequirements = [...editedJob.requirements];
  newRequirements[index] = e.target.value;
  setEditedJob({ ...editedJob, requirements: newRequirements });
};

export const addRequirement = (editedJob, setEditedJob) => {
  const updatedRequirements = [...editedJob.requirements, ""];
  setEditedJob({ ...editedJob, requirements: updatedRequirements });
};

export const removeRequirement = (index, editedJob, setEditedJob) => {
  const updatedRequirements = editedJob.requirements.filter(
    (_, reqIndex) => reqIndex !== index
  );
  setEditedJob({ ...editedJob, requirements: updatedRequirements });
};

export const saveChanges = async (
  editedJob,
  jobs,
  setJobs,
  setEditModeJobId,
  setEditedJob
) => {
  try {
    const { _id, createdAt, updatedAt, ...updateDetails } = editedJob;
    const user = localStorageUtils.getLocalStorageUser();
    const userId = user._id;

    const response = await jobService.updateJob(_id, {
      newData: updateDetails,
      userId: userId,
    });

    if (response.status === 200) {
      const updatedJobs = jobs.map((job) =>
        job._id === _id ? { ...job, ...updateDetails } : job
      );
      setJobs(updatedJobs);
      setEditModeJobId(null);
      setEditedJob({});
      toast.success("Job updated successfully!");
    } else {
      toast.error(`Failed to update job: ${response.data.message}`);
    }
  } catch (error) {
    toast.error("Failed to save job details. Please try again.");
  }
};

export const deleteJob = async (jobId, jobs, setJobs) => {
  try {
    const user = localStorageUtils.getLocalStorageUser();
    const userId = user._id;

    const response = await jobService.deleteJob(jobId, {userId: userId});
    if (response.status === 200) {
      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      toast.success("Job deleted successfully!");
    } else {
      toast.error(`Failed to delete job: ${response.data.message}`);
    }
  } catch (error) {
    toast.error("Failed to delete job. Please try again.");
  }
};
