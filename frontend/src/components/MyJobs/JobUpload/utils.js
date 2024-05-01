import jobService from "../../../services/jobService";
import localStorageUtils from "../../../utils/localStorageUtils";
import { toast } from "react-toastify";

export const handleChange = (e, formData, setFormData) => {
  const { name, value, type, checked } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: type === "checkbox" ? checked : value,
  }));
};

export const handleRequirementChange = (
  index,
  value,
  formData,
  setFormData
) => {
  setFormData((prevFormData) => {
    const newRequirements = [...prevFormData.requirements];
    newRequirements[index] = value;
    return { ...prevFormData, requirements: newRequirements };
  });
};

export const addRequirement = (formData, setFormData) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    requirements: [...prevFormData.requirements, ""],
  }));
};

export const handleSubmit = async (
  e,
  formData,
  setFormData,
  onClose,
  addJob
) => {
  e.preventDefault();

  const user = localStorageUtils.getLocalStorageUser();
  const userId = user._id;

  // add the user id to formData
  const dataWithUserId = {
    ...formData,
    userId,
  };

  console.log("here",dataWithUserId)

  try {
    const response = await jobService.createJob(dataWithUserId);
    if (response.status === 201) {
      toast.success("New job posted!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          onClose();
          addJob(response.data);
          setFormData({
            deadline: "",
            description: "",
            isCoverLetterNeeded: false,
            postedBy: "",
            requirements: [],
            title: "",
          }); // reset form
        },
      });
    } else {
      toast.error(`Failed to post job: ${response.data.message}`);
    }
  } catch (error) {
    toast.error("There was an error posting the job", error);
  }
};