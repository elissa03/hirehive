import React, { useState, useEffect } from 'react';
import styles from '../CV_form/CreateCV.module.css';  
import logo from '/images/logo.png';    
import cvFormUtils from '../CV_form/cvFormUtils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import lightcastAPIService from '../../services/lightcastAPIService';
import { useNavigate, useParams } from 'react-router-dom';
import cvService from '../../services/cvService';
import localStorageUtils from '../../utils/localStorageUtils';
import updateCvUtils from './updateCvUtils';

function UpdateCV() {
  
  const { cvId } = useParams();

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
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({})

  const addExperience = () => {
    setExperiences([...experiences, { title: '', company: '', location: '', startDate: '', endDate: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducationFields([...educationFields, { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', GPA: '',
                                              location: '', description: '' }]);
  }; 

  useEffect(() => {

    const fetchData = async () => {
      try {

        const userId = localStorageUtils.getLocalUserId();
        if (!userId) return;

        const response = await cvService.getCv(cvId, userId);
        if (response.status === 200) {
          const data = response.data;
          setFormData({
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            linkedin: data.linkedin,
            github: data.github,
            address: data.address,
            email: data.email,
            education: data.education || [],
            experience: data.experience || [],
            skills: data.skills || [],
            projects: data.projects || [],
            languages: data.languages || []
          });

          setSkills(data.skills || []);
          setEducationFields(data.education || []);
          setExperiences(data.experience || []); 
          setProjects(data.projects || []);
          setLanguages(data.languages || []);
          
        } else {
          console.error("Error fetching CV data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchData();
  }, [cvId]);

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
    const newProject = { title: '', URL: '' };
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

  const addLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: '' }]);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = languages.map((language, i) => {
      if (i === index) {
        return { ...language, [field]: value };
      }
      return language;
    });
    setLanguages(updatedLanguages);
  };

  const proficiencyOptions = ['Native', 'Fluent', 'Proficient', 'Intermediate', 'Elementary', 'Beginner'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {

    e.preventDefault();
  
    const trimmedFormData =  updateCvUtils.trimFormData(formData);
    trimmedFormData['education'] = educationFields;
    trimmedFormData['experience'] = experiences;
    trimmedFormData['skills'] = skills;
    trimmedFormData['languages'] = languages;
    
    const updateData = {userId: localStorageUtils.getLocalUserId(), newData: trimmedFormData};
    submitCv(updateData);

  };  

  const submitCv = async (updateData) => {

    try {
      const response = await cvService.updateCv(cvId, updateData);

      console.log(JSON.stringify(response))
      if(response.status === 200) {
        toast.success("CV updated successfully", {
          position: "top-right",
          autoClose: 2000, 
        });

        clearForm(); 
  
        setTimeout(() => {
          navigate(`/get-cv/${cvId}`);  
        }, 2000);

      }
      else {
        toast.error('An error occurred', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
    catch(error) {
      toast.error(error, {
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
      github: '',
      linkedin: '',
      education: [],
      experience: [],
      skills: [],
      projects: [],
      languages: []
    });
    setEducationFields([]);
    setExperiences([]);
    setSkills([]);
    setProjects([]);
    setLanguages([]);
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
          
        <label className={styles.label}>CV Title</label>
          <input className={styles.formControl} onChange={handleInputChange} value={formData.title} name="title" placeholder="Default Untitled"/>

          <div className={styles.row}>
            <div className={styles.column}> 
              <label className={styles.label}>First Name *</label>
              <input className={styles.formControl} onChange={handleInputChange} value={formData.firstName} name="firstName"
               placeholder="John" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label className={styles.label}>Last Name *</label>
              <input className={styles.formControl} onChange={handleInputChange} value={formData.lastName} name="lastName" 
              placeholder="Doe" autoComplete="off" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label className={styles.label}>Email *</label>
              <input className={styles.formControl} name="email" onChange={handleInputChange} value={formData.email}
               type="email" placeholder="john.doe@gmail.com" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label className={styles.label}>Phone Number</label>
              <input className={styles.formControl} name="phoneNumber" onChange={handleInputChange} 
              value={formData.phoneNumber} type="tel" autoComplete="off" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label className={styles.label}>LinkedIn </label>
              <input className={styles.formControl} name="linkedin" onChange={handleInputChange} value={formData.linkedin}
               type="text" placeholder="linkedin.com/in/your-username" autoComplete="off"/>
            </div>
            <div className={styles.column}>
              <label className={styles.label}>Github</label>
              <input className={styles.formControl} name="github" onChange={handleInputChange} 
              value={formData.github} placeholder='github.com/your-username' type="text" autoComplete="off" />
            </div>
          </div>
          <hr />
          <label className={styles.label}>Address</label>
          <input className={styles.formControl} onChange={handleInputChange} type="text" autoComplete='off' value={formData.address}
           placeholder='Beirut, Lebanon' name="address" /> 
 
        <div className={styles.row}>
          <div className={styles.column}>
            <label className={styles.label}>Skills</label>
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
                placeholder=" Python"
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
            <button type="button" className={`${styles.btnPrimary} ${styles.addSkill}`} onClick={addSkill}>Add Skill</button> 
            </div></div>

          <hr />
          <div className={styles.section}>
            <h5>Experience</h5>
            <button type="button" className={styles.btnPrimary} onClick={addExperience}>Add Experience</button>
            {experiences.map((experience, index) => (
              <div key={index} className={styles.fieldset}>

                <label className={styles.label}>Role *</label>
                <input className={styles.formControl} value={experience.title} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].title = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Job title" required />

                <label className={styles.label}>Company *</label>
                <input className={styles.formControl} value={experience.company} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].company = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="University of Balamand" required />

                <label className={styles.label}>Location *</label>
                <input className={styles.formControl} value={experience.location} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].location = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Remote" required />

                <label className={styles.label}>From *</label>
                <input className={styles.formControl} value={experience.startDate} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].startDate = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder=" May 2021" required />
                <label className={styles.label}>Till</label>
                <input className={styles.formControl} value={experience.endDate} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].endDate = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Present" />
                <label className={styles.label}>Details * </label>
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

                <label className={styles.label}> School *</label>
                <input className={styles.formControl} value={education.school} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].school = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder=" University of Balamand" required />
 
                <label className={styles.label}> Degree *</label>
                <input className={styles.formControl} value={education.degree} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].degree = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="B.S. / B.E." required /> 

                <label className={styles.label}> Field of Study *</label>
                <input className={styles.formControl} value={education.fieldOfStudy} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].fieldOfStudy = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder=" Computer Science" required /> 
                
                <label className={styles.label}> Location *</label>
                <input className={styles.formControl} value={education.location} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].location = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Lebanon" required /> 

                <label className={styles.label}> GPA </label>
                <input className={styles.formControl} value={education.GPA} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].GPA = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="3.75/4 or 85/100" /> 

                <label className={styles.label}>From * </label>
                <input className={styles.formControl} value={education.startDate} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].startDate = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder=" September 2021" required/>

                <label className={styles.label}>Till</label>
                <input className={styles.formControl} value={education.endDate} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].endDate = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="(Expected) Graduation Month and Year" />

                <label className={styles.label}>Details * </label>
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
              <label className={styles.label}>Title *</label>
              <input
                className={styles.formControl}
                value={project.title}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                placeholder=" Personal Website"
                required
              />
              <label className={styles.label}>URL</label>
              <input
                className={styles.formControl}
                value={project.URL}
                onChange={(e) => handleProjectChange(index, 'URL', e.target.value)}
                placeholder=" http://www.example.com"
              />

              <button type="button" className={styles.btnDanger} onClick={() => removeProject(index)}>Remove</button>
            </div>
          ))}
        </div>
        <hr />
        <div className={styles.section}>
            <h5>Languages</h5>
            <button type="button" className={styles.btnPrimary} onClick={addLanguage}>Add Language</button>
            {languages.map((language, index) => (
              <div key={index} className={styles.fieldset}>
                <label className={styles.label}>Language *</label>
                <input
                  className={styles.formControl}
                  value={language.language}
                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                  placeholder="English"
                  required
                />
                <label className={styles.label}>Proficiency *</label>
                <select
                  className={styles.formControl}
                  value={language.proficiency}
                  onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                  required
                >
                  <option value="">Select Proficiency</option>
                  {proficiencyOptions.map((level, i) => (
                    <option key={i} value={level}>{level}</option>
                  ))}
                </select>
                <button type="button" className={styles.btnDanger} onClick={() => removeLanguage(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <hr></hr><div className={styles.submitSection}>
          <input type='submit' value='Update CV' className={styles.submitButton} /> </div>
        </form>
      </div>
    </>
  );
}

export default UpdateCV;
