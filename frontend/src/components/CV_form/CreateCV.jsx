import React, { useState, useEffect } from 'react';
import styles from './CreateCV.module.css';  
import logo from '/images/logo.png';    
import cvFormUtils from './cvFormUtils';
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner';  
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "react-toastify/dist/ReactToastify.css"; 
import lightcastAPIService from '../../services/lightcastAPIService';  
import { useNavigate } from 'react-router-dom'; 

function CreateCV() {

  const navigate = useNavigate(); // Create an instance of useNavigate

  // Function to handle back navigation
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
    setExperiences([...experiences, { title: '', since: '', till: '', details: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducationFields([...educationFields, { title: '', since: '', till: '', details: '' }]);
  };

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


  return (
    <>
      <div className={styles.top}><div className={styles.backButton} onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> {/* Back arrow icon */}
      </div>
      <div className={styles.logoSection} onClick={()=> window.location.reload()}>
        <img src={logo} alt="Company Logo" className={styles.logo} />
      </div></div>
      <div className={styles.wrapper}>
        <h4>CV</h4>
        <form className={styles.form}>
          
        <label>CV Title</label>
          <input className={styles.formControl} name="title" placeholder="Default Untitled"/>

          <div className={styles.row}>
            <div className={styles.column}> 
              <label>First Name *</label>
              <input className={styles.formControl} name="firstName" placeholder="John" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label>Last Name *</label>
              <input className={styles.formControl} name="lastName" placeholder="Doe" autoComplete="off" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label>Email *</label>
              <input className={styles.formControl} name="email" type="email" placeholder="j@gmail.com" autoComplete="off" required />
            </div>
            <div className={styles.column}>
              <label>Phone Number</label>
              <input className={styles.formControl} name="phoneNumber" type="tel" autoComplete="off" />
            </div>
          </div>
          <hr />
          <label>Address</label>
          <input className={styles.formControl} name="location" /> 
 
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
                placeholder="i.e. Python"
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
                <label>From *</label>
                <input className={styles.formControl} value={experience.since} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].since = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="i.e. May 2021" required />
                <label>Till</label>
                <input className={styles.formControl} value={experience.till} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].till = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Present" />
                <label>Details * </label>
                <textarea className={styles.formControl} value={experience.details} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].details = e.target.value;
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
                <input className={styles.formControl} value={education.title} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].title = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="i.e. University of Balamand" required />
                <label>From * </label>
                <input className={styles.formControl} value={education.since} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].since = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="i.e. September 2021" required/>
                <label>Till</label>
                <input className={styles.formControl} value={education.till} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].till = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="(Expected) Graduation Month and Year" />
                <label>Details * </label>
                <textarea className={styles.formControl} value={education.details} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].details = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Enter Description"></textarea>
                <button type="button" className={styles.btnDanger} onClick={() => removeEducation(index)}>Remove</button>
              </div>
            ))}
          </div>
          <hr /><div className={styles.submitSection}>
          <input type='submit' value='Create CV' className={styles.submitButton} /> </div>
        </form>
      </div>
    </>
  );
}

export default CreateCV;
