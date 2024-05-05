import React, { useState, useEffect } from 'react';
import styles from './CreateCV.module.css';  
import logo from '/images/logo.png';    
import cvFormUtils from './cvFormUtils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import lightcastAPIService from '../../services/lightcastAPIService';
import { useNavigate } from 'react-router-dom';

function CreateCV() {

  // arrow functionality to return to previous page
  const navigate = useNavigate();   
  const goBack = () => {
    navigate(-1);
  };

  const [experiences, setExperiences] = useState([]);
  const [educationFields, setEducationFields] = useState([]);
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [activeInputIndex, setActiveInputIndex] = useState(-1); 

  const addExperience = () => {
    setExperiences([...experiences, { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducationFields([...educationFields, { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }]);
  };

  const [formData, setFormData] = useState({
    title: '', firstName: '', lastName: '', phoneNumber: '', address: '',
    email: '', education: [], experience: [], skills: []
  });

  const removeEducation = (index) => {
    setEducationFields(educationFields.filter((_, i) => i !== index));
  }; 

  useEffect(() => {
    const handleBeforeUnload = event => { 
      event.preventDefault(); 
      event.returnValue = '';
    };
 
    window.addEventListener('beforeunload', handleBeforeUnload);
 
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);    

  // code chunk needed to retrieve suggestions from api
  const [token, setToken] = useState('');
  
  const [apiSkills, setApiSkills] = useState([]); 
  
  // get the token to be able to communicate with external API
  useEffect(() => { 

    const fetchToken = async ()=> {
      const token = await lightcastAPIService.fetchToken();
      
      setToken(token);
    }  

    fetchToken();
  }, []);

  
  // get the skills from the extern al API if functional
  useEffect(() => { 
 
    const softSkills = cvFormUtils.SOFT_SKILLS, staticSkills = cvFormUtils.STATIC_SKILLS;
    var totalSkills = [... softSkills, ...staticSkills];

    if (token) {
      
      const fetchApiSkills = async() => {
         
        totalSkills = await lightcastAPIService.fetchSkills(token);
        setApiSkills(totalSkills);

      }

      fetchApiSkills(); 
    }
    else
      setApiSkills(totalSkills); 
    
  }, [token]); 
  // backend process + api data retrieval end  
  
  // functions to add a skill to skills array, remove, and update selection
  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40 && activeSuggestionIndex < suggestions.length - 1) {
      e.preventDefault();  // Prevent page scrolling
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    } else if (e.keyCode === 38 && activeSuggestionIndex > 0) {
      e.preventDefault();  // Prevent page scrolling
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.keyCode === 13) {
      e.preventDefault();  // Prevent form submission
      if (suggestions.length > 0) {
        selectSuggestion(suggestions[activeSuggestionIndex]);
      }
    }
  };

  const updateSkill = (index, value) => {
    setActiveInputIndex(index);   
    const trimmedValue = value.trim();
    const newSkills = [...skills];
    newSkills[index] = trimmedValue;
    setSkills(newSkills);
    if (trimmedValue) {
      setSuggestions(apiSkills.filter(skill => skill.toLowerCase().includes(trimmedValue.toLowerCase()))); 
    } else {
      setSuggestions([]);
    }
    setActiveSuggestionIndex(0);
  };

  const selectSuggestion = (skill) => {
    const newSkills = [...skills];
    newSkills[activeInputIndex] = skill.trim();
    setSkills(newSkills);
    setSuggestions([]);
    setActiveSuggestionIndex(0);
    setActiveInputIndex(-1);  // Reset active input index
  };
  
  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const [projects, setProjects] = useState([]);

  const addProject = () => {
    const newProject = { title: '', url: '' };
    setProjects([...projects, newProject]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = projects.map((project, i) => {
      if (i === index) {
        return { ...project, [field]: value };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
   
    const trimmedFormData = {
      title: (formData.title || "Untitled").trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      email: formData.email.trim(),
      education: educationFields,
      experience: experiences,
      skills: skills
    };
   
    if (!trimmedFormData.firstName || !trimmedFormData.lastName || !trimmedFormData.email) {
      toast.error("Please fill out all required fields", {
        position: "top-right",
        autoClose: 2000, 
      });
      return;
    }
   
    console.log("CV Data to send:", trimmedFormData);
   
    submitCv(trimmedFormData);
  };  

  const submitCv = async (cvData) => {

    const response = await cvFormUtils.createCv(cvData);

    if(response.status === 201) {
      toast.success("CV created successfully", {
        position: "top-right",
        autoClose: 2000, 
      });

      clearForm();
 
    // setTimeout(() => {
    //   navigate('/desired-page');  
    // }, 2000);

    }
    else {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }

  }

  const clearForm = () => { 
    setFormData({
      title: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      email: '',
      education: [],
      experience: [],
      skills: [],
    });
    setEducationFields([]);
    setExperiences([]);
    setSkills([]);
    setProjects([]);
  };

  return (
    <>
    
      <ToastContainer />
      <div className={styles.top}><div className={styles.backButton} onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {/* Back arrow icon */}
      </div>
      <div className={styles.logoSection} onClick={()=> window.location.reload()}>
        <img src={logo} alt="Company Logo" className={styles.logo} />
      </div></div>
      <div className={styles.wrapper}>
        <h4>CV</h4>
        <form className={styles.form} onSubmit={handleSubmit}>
          
        <label>CV Title</label>
          <input className={styles.formControl} onChange={handleInputChange} value={formData.title} name="title" placeholder="Default Untitled"/>

          <div className={styles.row}>
            <div className={styles.column}> 
              <label>First Name *</label>
              <input className={styles.formControl} onChange={handleInputChange} value={formData.firstName} name="firstName"
               placeholder="John" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label>Last Name *</label>
              <input className={styles.formControl} onChange={handleInputChange} value={formData.lastName} name="lastName" 
              placeholder="Doe" autoComplete="off" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label>Email *</label>
              <input className={styles.formControl} name="email" onChange={handleInputChange} value={formData.email}
               type="email" placeholder="j@gmail.com" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label>Phone Number</label>
              <input className={styles.formControl} name="phoneNumber" onChange={handleInputChange} 
              value={formData.phoneNumber} type="tel" autoComplete="off" />
            </div>
          </div>
          <hr />
          <label>Address</label>
          <input className={styles.formControl} onChange={handleInputChange} type="text" autoComplete='off' value={formData.address} name="address" /> 
 
        <div className={styles.row}>
          <div className={styles.column}>
            <label>Skills</label>
            <div className={styles.skillsGrid}> 
            
            {skills.map((skill, index) => (
            <div key={index} className={styles.skillInput}>
              <input
                className={styles.formControl}
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                onFocus={() => setActiveInputIndex(index)}
                onBlur={() => setActiveInputIndex(-1)}
                placeholder="e.g. Python"
              />
              {activeInputIndex === index && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      onClick={() => selectSuggestion(suggestion)}
                      className={i === activeSuggestionIndex ? styles.activeSuggestion : ""}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" className={styles.removeSkill} onClick={() => removeSkill(index)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
            </div>
            <button type="button" className={styles.btnPrimary} onClick={addSkill}>Add Skill</button> 
            </div></div>

          <hr />
          <div className={styles.section}>
            <h5>Experience</h5>
            <button type="button" className={styles.btnPrimary} onClick={addExperience}>Add Experience</button>
            {experiences.map((experience, index) => (
              <div key={index} className={styles.fieldset}>

                <label>Role *</label>
                <input className={styles.formControl} value={experience.title} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].title = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Job title" required />

                <label>Company *</label>
                <input className={styles.formControl} value={experience.company} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].company = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="University of Balamand" required />

                <label>Location *</label>
                <input className={styles.formControl} value={experience.location} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].location = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Remote" required />

                <label>From *</label>
                <input className={styles.formControl} value={experience.startDate} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].startDate = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="e.g. May 2021" required />
                <label>Till</label>
                <input className={styles.formControl} value={experience.endDate} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].endDate = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Present" />
                <label>Details * </label>
                <textarea className={styles.formControl} value={experience.description} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].description = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Explain your role" required ></textarea>
                <button type="button" className={styles.btnDanger} onClick={() => removeExperience(index)}>Remove</button>
              </div>
            ))}
          </div>
          <hr />

          <div className={styles.section}>
            <h5>Education</h5>
            <button type="button" className={styles.btnPrimary} onClick={addEducation}>Add Education</button>
            {educationFields.map((education, index) => (
              <div key={index} className={styles.fieldset}>

                <label> School *</label>
                <input className={styles.formControl} value={education.school} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].school = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="e.g. University of Balamand" required />
 
                <label> Degree *</label>
                <input className={styles.formControl} value={education.degree} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].degree = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="e.g. Bachelor of Science" required /> 

                <label> Field of Study *</label>
                <input className={styles.formControl} value={education.fieldOfStudy} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].fieldOfStudy = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="e.g. Computer Science" required /> 
                
                <label>From * </label>
                <input className={styles.formControl} value={education.startDate} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].startDate = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="e.g. September 2021" required/>

                <label>Till</label>
                <input className={styles.formControl} value={education.endDate} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].endDate = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="(Expected) Graduation Month and Year" />

                <label>Details * </label>
                <textarea className={styles.formControl} value={education.description} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].description = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Enter Description"></textarea>
                <button type="button" className={styles.btnDanger} onClick={() => removeEducation(index)}>Remove</button>
              </div>
            ))}
          </div>

          <hr />
          <div className={styles.section}>
          <h5>Projects</h5>
          <button type="button" className={styles.btnPrimary} onClick={addProject}>Add Project</button>
          {projects.map((project, index) => (
            <div key={index} className={styles.fieldset}>
              <label>Title *</label>
              <input
                className={styles.formControl}
                value={project.title}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                placeholder="e.g. Personal Website"
                required
              />
              <label>URL</label>
              <input
                className={styles.formControl}
                value={project.url}
                onChange={(e) => handleProjectChange(index, 'url', e.target.value)}
                placeholder="e.g. http://www.example.com"
              />
              <button type="button" className={styles.btnDanger} onClick={() => removeProject(index)}>Remove</button>
            </div>
          ))}
        </div>

          <hr></hr><div className={styles.submitSection}>
          <input type='submit' value='Create CV' className={styles.submitButton} /> </div>
        </form>
      </div>
    </>
  );
}

export default CreateCV;
