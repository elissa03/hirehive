import React, { useState, useEffect }  from 'react';
import styles from './IndividualCV.module.css';  
import { TailSpin } from 'react-loader-spinner'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faTrash, faMagicWandSparkles, faTimes } from '@fortawesome/free-solid-svg-icons';  
import logo from '/images/logo.png';  
import { useNavigate, useParams } from 'react-router-dom'; 
import cvService from '../../services/cvService';
import localStorageUtils from '../../utils/localStorageUtils';
import cvFormUtils from '../CV_form/cvFormUtils'; 
import { ToastContainer, toast } from "react-toastify";
import openAiService from '../../services/openAiService';

const IndividualCV = () => {
  const navigate = useNavigate();   
  const goBack = () => {
    navigate(-1);
  };

  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const { cvId } = useParams();
  console.log(cvId);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try { 
        const userId = localStorageUtils.getLocalUserId();
      
        if (!userId)
          return;

        const response = await cvService.getCv(cvId, userId);
        console.log(JSON.stringify(response.data));

        if(response.status === 200) 
          setCvData(response.data);   

        else
        
          console.error("Error fetching CV data:", error);

        setLoading(false);

      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchData();
  }, []);
 
  const { softSkills, otherSkills } = cvData?.skills ? categorizeSkills(cvData.skills) : { softSkills: [], otherSkills: [] };

  function categorizeSkills(allSkills, softSkillsArray=cvFormUtils.SOFT_SKILLS) {
    
    let softSkills = [], otherSkills = [];

    allSkills.forEach((skill) => {
      const formattedSkill = skill.trim().toLowerCase();
      if (softSkillsArray.map(s => s.toLowerCase()).includes(formattedSkill)) {
        softSkills.push(skill);
      } else {
        otherSkills.push(skill);
      }
    });
  
    return { softSkills, otherSkills };
  }
  
  const stripHttp = (url) => url.replace(/^https?:\/\//, '');
  const splitDescriptionIntoList = (description) => {
    if (!description) return []; 
    return description
      .split('.')  
      .filter(Boolean) // Remove empty strings
      .map(item => item.trim().replace(/^[*-\s]+/, '')); // Remove leading special characters
  };

  const DeleteConfirmationModal = () => {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <span>Are you sure you want to delete this CV?</span><br></br>
          {/* <span font-size='12px'>( This CV was used in {cvData.jobApps.length} application(s))</span> */}
          <div className={styles.modalButtons}>
            <button onClick={handleDelete} className={styles.confirmButton}>Confirm</button>
            <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };
  
  const handleDelete = async () => {
    try { 

      const userId = localStorageUtils.getLocalUserId();
      
      if (!userId)
        return;

      const response = await cvService.deleteCv(cvId, userId);
 
      if(response.status === 200) { 

        toast.success("CV deleted successfully", {
          position: "top-right",
          autoClose: 2000,  
        });
        
        setTimeout(() => {
          localStorage.setItem('activeComponent', 'cvs');
          navigate('/dashboard');   
        }, 3000); 

      }
      
      else {
        toast.error("Error deleting CV", {
          position: "top-right",
          autoClose: 2000, // display for 2 seconds 
        });
      } 

    } catch (error) {
      console.error("There was an error fetching the cvs:", error);
      toast.error("Error deleting CV", {
        position: "top-right",
        autoClose: 2000, // display for 2 seconds 
      });
    }
  };

  const CustomizeModal = () => {
    const handleSubmit = async () => {
      try {

        const userId = localStorageUtils.getLocalUserId();

        if (!userId) {
          toast.error("You can't customize the CV, try logging in again.", {
            position: "top-right",
            autoClose: 2000,
          });

          return;
        }

        if (!jobDescription || (cvData.experience.length === 0 && cvData.education.length === 0)) {
          toast.error("You can't customize an empty CV!", {
            position: "top-right",
            autoClose: 2000,
          });
          return;
        }

        const data_to_customize = {'experience': cvData.experience, 'education': cvData.education, 
                                   'skills': cvData.skills, 'projects': cvData.projects} 

        toast.success('Customized CV successfully!', {
          position: "top-right",
          autoClose: 2000, 
        });

        console.log(data_to_customize);

        const response = await openAiService.customizeCv(data_to_customize, jobDescription)

        console.log(response)
        const new_data = JSON.parse(response);

        try {
          const updateData = {userId: userId, newData: new_data};

          const updateResponse = await cvService.updateCv(cvId, updateData);

          if(updateResponse.status === 200) {
            toast.success("CV updated successfully", {
              position: "top-right",
              autoClose: 2000, 
            });
    
            setJobDescription('');  
            setShowCustomizeModal(false); 
      
            setTimeout(() => {
              window.location.reload()
            }, 2000);
    
          }
          else {
            toast.error('An error occurred', {
              position: "top-right",
              autoClose: 2000,
            });
          }
        }
        catch (error) {

          toast.error('Error updating CV!', {
            position: "top-right",
            autoClose: 2000, 
          }
          )

        }
        

      } catch(error) {
        toast.error('Error customizing CV!', {
          position: "top-right",
          autoClose: 2000, 
        }
        )
      }
      console.log("Submitted Job Description:", jobDescription); 
      setJobDescription('');  
      setShowCustomizeModal(false);  
    };
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={() => setShowCustomizeModal(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h5>Enter Job Description</h5>
          <textarea
            className={styles.textArea}
            placeholder="Paste the job description here..."
            rows="10"
            value={jobDescription}
            // onBlur={(e) => setJobDescription(e.target.value)}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea> 
          <button onClick={handleSubmit} className={styles.submitButton}>Customize</button>
        </div>
      </div>
    );
  };
  
  
  
  const renderControlButtons = () => {
    const userId = localStorageUtils.getLocalUserId();
    if (userId && cvData.user && userId === cvData.user.toString()) {
      return (
        <div className={styles.controlButtons}>

          <button onClick={() => setShowCustomizeModal(true)} className={`${styles.button} ${styles.customizeButton}`}>
            <FontAwesomeIcon icon={faMagicWandSparkles} /> Customize
          </button>

          <button onClick={()=> navigate(`/update-cv/${cvId}`)} className={`${styles.button} ${styles.editButton}`}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
          
          <button onClick={()=> setShowDeleteModal(true)} className={`${styles.button} ${styles.deleteButton}`}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      );
    }
    return null;
  };
  

  return (
    <>
    
    <ToastContainer />
    
      <div className={styles.mainContainer}>
        <div className={styles.top}>
          <div className={styles.backButton} onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> {/* Back arrow icon */}
          </div>
          <div className={styles.logoSection} onClick={() => window.location.reload()}>
            <img src={logo} alt="Company Logo" className={styles.logo} />
          </div>
        </div>
        
        <div className={styles.container}>
          {loading ? (
          <div className={styles.centeredLoader}>   
            <TailSpin
              color="#fbf07de1"
              height={70}
              width={70}
            />
          </div> // loading indicator
        ) : (
          <>
            {renderControlButtons()}
            {showDeleteModal && <DeleteConfirmationModal />}
            {showCustomizeModal && <CustomizeModal />}

            <div className={styles.cvContent}>
              <div className={styles.heading}>
                <h1>{cvData.firstName.toUpperCase()} {cvData.lastName.toUpperCase()}</h1>
                <p className={styles.text}>
                  {cvData.phoneNumber ? <a href={`tel:${cvData.phoneNumber}`}>{cvData.phoneNumber}</a> : ''}
                  {cvData.phoneNumber && cvData.address? ` • `: ''}
                  {cvData.address ? ` ${cvData.address}` : ''}
                </p>
                <p className={styles.text}>
                  {cvData.email ? <a href={`mailto:${cvData.email}`}>{cvData.email.toLowerCase()}</a> : ''}
                  {cvData.linkedin ? (
                    <>
                      {' • '}
                      <a href={`https://${stripHttp(cvData.linkedin)}`} target="_blank" rel="noopener noreferrer">
                        {stripHttp(cvData.linkedin)}
                      </a>
                    </>
                  ) : ''}
                  {cvData.github ? (
                    <>
                      {' • '}
                      <a href={`https://${stripHttp(cvData.github)}`} target="_blank" rel="noopener noreferrer">
                        {stripHttp(cvData.github)}
                      </a>
                    </>
                  ) : ''}
                </p>
              </div>

              {cvData.education && cvData.education.length > 0 && (
                <>
                  <h2 className={styles.sectionTitle}>EDUCATION</h2>
                  <hr className={styles.separator} /> 
                  {cvData.education.map((edu, index) => (
                    <div key={index}>
                      <div className={styles.titleRow}>
                        <p className={styles.title}>{`${edu.degree} in ${edu.fieldOfStudy}, ${edu.school}`}</p>
                        <p className={styles.date}>{`${edu.startDate} - ${edu.endDate}`}</p>
                      </div>
                      <ul className={`${styles.list} list-disc`}>
                        {splitDescriptionIntoList(edu.description).map((item, i) => (
                          <li key={i} className={styles.listItem}>{item}</li>
                        ))}
                      </ul> 
                    </div>
                  ))}
                </>
              )}



            {cvData.skills && cvData.skills.length > 0 && (
            <> 
            <h2 className={styles.sectionTitle}>SKILLS</h2> 
            <hr className={styles.separator} /> 
            {softSkills.length > 0 && otherSkills.length > 0 ? (
              <>
                <div className={styles.skillRow}>
                  <p className={styles.title}>Techinal Skills:</p>
                  <p className={styles.text}>{otherSkills.join(', ')}</p>
                </div>
                <div className={styles.skillRow}>
                  <p className={styles.title}>Soft Skills:</p>
                  <p className={styles.text}>{softSkills.join(', ')}</p>
                </div>
              </>
            ) : (
              <div className={styles.skillRow}>
                <p className={styles.title}>All Skills:</p>
                <p className={styles.text}>{cvData.skills.join(', ')}</p>
              </div>
            )} 
          </>
        )} 

            {cvData.experience && cvData.experience.length > 0 && (
              <>
              
              <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
            < hr className={styles.separator} />  
                {cvData.experience.map((exp, index) => (
                  <div key={index}>
                    <div className={styles.titleRow}>
                      <p className={styles.title}>{exp.title}</p>
                      <p className={styles.date}>{`${exp.startDate} - ${exp.endDate}`}</p>
                    </div>
                    <p className={styles.text}>{exp.company}</p>
                    <p className={styles.text}>{exp.location}</p>
                    <ul className={`${styles.list} list-disc`}>
                      {splitDescriptionIntoList(exp.description).map((item, i) => (
                        <li key={i} className={styles.listItem}>{item}</li>
                      ))}
                    </ul> 
                  </div>
                ))}
              </>
            )}

            {cvData.projects && cvData.projects.length > 0 ? (
              <>
                <h2 className={styles.sectionTitle}>PROJECTS</h2>
                <hr className={styles.separator} />
                <ul className={`${styles.list} list-disc`}>
                  {cvData.projects.map((project, index) => {
                    const projectUrl = project.URL ? project.URL.replace(/^https?:\/\//, '') : null;
                    return (
                      <li key={index} className={styles.listItem}>
                        {projectUrl ? (
                          // Make the project name clickable if there's a URL
                          <a
                            href={`https://${projectUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.text} font-semibold`}
                          >
                            {project.title}
                          </a>
                        ) : (
                          // Display the project name as plain text if there's no URL
                          <p className={`${styles.text} font-semibold`}>{project.title}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <></>
            )}

          </div></>
      )}
      
      </div>
      </div>
    </>
  );
};

export default IndividualCV;
