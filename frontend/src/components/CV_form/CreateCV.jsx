// import React, { useState, useEffect } from 'react';
// import "./CreateCV.module.css";  
// import { ToastContainer, toast } from "react-toastify";
// import { TailSpin } from 'react-loader-spinner'; 
// import "react-toastify/dist/ReactToastify.css"; 
// function CreateCV() {

//   const [experiences, setExperiences] = useState([]);
//   const [educationFields, setEducationFields] = useState([]);

//   const addExperience = () => {
//     setExperiences([...experiences, { title: '', since: '', till: '', details: '' }]);
//   };

//   const removeExperience = (index) => {
//     setExperiences(experiences.filter((_, i) => i !== index));
//   };

//   const addEducation = () => {
//     setEducationFields([...educationFields, { title: '', since: '', till: '', details: '' }]);
//   };

//   const removeEducation = (index) => {
//     setEducationFields(educationFields.filter((_, i) => i !== index));
//   };


//   return (
//     <>
//       <div id="wrapper">
//         <div id="left-wrapper" className="container">
//           <h4> CV </h4>
//           <form id="inputData" way-data="inputData" way-persistent className="form-group">
//             <fieldset className="form-group">
//               <label>Full Name</label>
//               <input className="form-control" name="fullName" />
//               <label>Email</label>
//               <input className="form-control" name="email" /> 
//             </fieldset>
//             <hr />
//             <fieldset className="form-group">
//               <label>Title</label><input className="form-control" name="title" />
//               <label>Location</label><input className="form-control" name="location" /> 
//               <label>Skills</label><input className="form-control" name="tech" />
//             </fieldset>
//             <hr />
//             <fieldset className="form-group">
//               <label>About</label>
//               <textarea className="form-control" name="about" rows="4"></textarea>
//             </fieldset>
//             <hr />
//             <fieldset className="form-group">
//             <h5>Experience</h5>
//               <button type="button" className="btn btn-primary" onClick={addExperience}>Add Experience</button>
//               {experiences.map((experience, index) => (
//                 <fieldset key={index} className="form-group">
//                   <label>Title</label>
//                   <input className="form-control" value={experience.title} onChange={e => {
//                     const newExperiences = [...experiences];
//                     newExperiences[index].title = e.target.value;
//                     setExperiences(newExperiences);
//                   }} placeholder="Job title" />
                  
//                   <div className="form-inline">
//                     <label>From</label>
//                     <input className="form-control" value={experience.since} onChange={e => {
//                       const newExperiences = [...experiences];
//                       newExperiences[index].since = e.target.value;
//                       setExperiences(newExperiences);
//                     }} placeholder="Month & Year" />
//                     <label>Till</label>
//                     <input className="form-control" value={experience.till} onChange={e => {
//                       const newExperiences = [...experiences];
//                       newExperiences[index].till = e.target.value;
//                       setExperiences(newExperiences);
//                     }} placeholder="Default: Present" />
//                   </div>
                  
//                   <label>Details</label>
//                   <textarea className="form-control" value={experience.details} onChange={e => {
//                     const newExperiences = [...experiences];
//                     newExperiences[index].details = e.target.value;
//                     setExperiences(newExperiences);
//                   }} placeholder="Explain your role"></textarea>
                  
//                   <button type="button" className="btn btn-danger" onClick={() => removeExperience(index)}>Remove</button>
//               </fieldset>
//               ))}
//             </fieldset>
//             <hr />
//             <h5>Education</h5>
//             <button type="button" className="btn btn-primary" onClick={addEducation}>Add Education</button>
//             {educationFields.map((education, index) => (
//               <fieldset key={index} className="form-group">
//                 <label>Title</label>
//                 <input className="form-control" value={education.title} onChange={e => {
//                   const newEducationFields = [...educationFields];
//                   newEducationFields[index].title = e.target.value;
//                   setEducationFields(newEducationFields);
//                 }} placeholder="Your course name?" />
//                 <div className="form-group">
//                   <label>From</label>
//                   <input className="form-control" value={education.since} onChange={e => {
//                     const newEducationFields = [...educationFields];
//                     newEducationFields[index].since = e.target.value;
//                     setEducationFields(newEducationFields);
//                   }} placeholder="Year admitted in" />
//                   <label>Till</label>
//                   <input className="form-control" value={education.till} onChange={e => {
//                     const newEducationFields = [...educationFields];
//                     newEducationFields[index].till = e.target.value;
//                     setEducationFields(newEducationFields);
//                   }} placeholder="Graduate(d) at" />
//                 </div>
//                 <label>Details</label>
//                 <textarea className="form-control" value={education.details} onChange={e => {
//                   const newEducationFields = [...educationFields];
//                   newEducationFields[index].details = e.target.value;
//                   setEducationFields(newEducationFields);
//                 }} placeholder="Enter Description"></textarea>
//                 <button type="button" className="btn btn-danger" onClick={() => removeEducation(index)}>Remove</button>
//               </fieldset>
//             ))}
//             <hr />
//             <fieldset className="form-group">
//               <h5>Projects</h5>
//               <button way-action-push="inputData.projects" className="btn btn-primary">Add project</button>
//               <fieldset className="form-group" way-repeat="inputData.projects">
//                 <label>Title</label><input className="form-control" way-persistent way-data="title" placeholder="Title" />
//                 <label>URL</label><input className="form-control" way-persistent way-data="url" placeholder="https://github.com/username/project" /> 
//                 <button way-action-remove="inputData.projects.$$key" way-persistent className="btn btn-danger">Remove</button>
//               </fieldset>
//             </fieldset> 
//             <input type='submit' label='submit' className='submit' />
//           </form>
//         </div>
        
//       </div>
//     </>
//   );
// }

// export default CreateCV;
import React, { useState } from 'react';
import styles from './CreateCV.module.css';  
import logo from '/images/logo.png'; // Adjust the path to your logo as needed
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner'; 
import "react-toastify/dist/ReactToastify.css"; 

function CreateCV() {
  const [experiences, setExperiences] = useState([]);
  const [educationFields, setEducationFields] = useState([]);

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

  return (
    <>
      <div className={styles.logoSection}>
        <img src={logo} alt="Company Logo" className={styles.logo} /></div>
      <div className={styles.wrapper}>
        <h4>CV</h4>
        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.column}> 
              <label>First Name</label>
              <input className={styles.formControl} name="firstName" autoComplete="off" />
            </div>
            <div className={styles.column}>
              <label>Last Name</label>
              <input className={styles.formControl} name="lastName" autoComplete="off" />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              <label>Email</label>
              <input className={styles.formControl} name="email" type="email" autoComplete="off" />
            </div>
            <div className={styles.column}>
              <label>Phone Number</label>
              <input className={styles.formControl} name="phoneNumber" type="tel" autoComplete="off" />
            </div>
          </div>
          <hr />
          <label>CV Title</label>
          <input className={styles.formControl} name="title" />
          <label>Address</label>
          <input className={styles.formControl} name="location" />
          <label>Skills</label>
          <input className={styles.formControl} name="tech" /> 
          <hr />
          <div className={styles.section}>
            <h5>Experience</h5>
            <button type="button" className={styles.btnPrimary} onClick={addExperience}>Add Experience</button>
            {experiences.map((experience, index) => (
              <div key={index} className={styles.fieldset}>
                <label>Title</label>
                <input className={styles.formControl} value={experience.title} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].title = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Job title" />
                <label>From</label>
                <input className={styles.formControl} value={experience.since} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].since = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Month & Year" />
                <label>Till</label>
                <input className={styles.formControl} value={experience.till} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].till = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Present" />
                <label>Details</label>
                <textarea className={styles.formControl} value={experience.details} onChange={e => {
                  const newExperiences = [...experiences];
                  newExperiences[index].details = e.target.value;
                  setExperiences(newExperiences);
                }} placeholder="Explain your role"></textarea>
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
                <label>Title</label>
                <input className={styles.formControl} value={education.title} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].title = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Your course name?" />
                <label>From</label>
                <input className={styles.formControl} value={education.since} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].since = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Year admitted in" />
                <label>Till</label>
                <input className={styles.formControl} value={education.till} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].till = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Graduated at" />
                <label>Details</label>
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
