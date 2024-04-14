import React, { useState } from 'react';
import "./CVs.module.css"; 
function CVs() {

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
      <div id="wrapper">
        <div id="left-wrapper" className="container">
          <h4> CV </h4>
          <form id="inputData" way-data="inputData" way-persistent className="form-group">
            <fieldset className="form-group">
              <label>Full Name</label>
              <input className="form-control" name="fullName" />
              <label>Email</label>
              <input className="form-control" name="email" /> 
            </fieldset>
            <hr />
            <fieldset className="form-group">
              <label>Title</label><input className="form-control" name="title" />
              <label>Location</label><input className="form-control" name="location" /> 
              <label>Skills</label><input className="form-control" name="tech" />
            </fieldset>
            <hr />
            <fieldset className="form-group">
              <label>About</label>
              <textarea className="form-control" name="about" rows="4"></textarea>
            </fieldset>
            <hr />
            <fieldset className="form-group">
            <h5>Experience</h5>
              <button type="button" className="btn btn-primary" onClick={addExperience}>Add Experience</button>
              {experiences.map((experience, index) => (
                <fieldset key={index} className="form-group">
                  <label>Title</label>
                  <input className="form-control" value={experience.title} onChange={e => {
                    const newExperiences = [...experiences];
                    newExperiences[index].title = e.target.value;
                    setExperiences(newExperiences);
                  }} placeholder="Job title" />
                  
                  <div className="form-inline">
                    <label>From</label>
                    <input className="form-control" value={experience.since} onChange={e => {
                      const newExperiences = [...experiences];
                      newExperiences[index].since = e.target.value;
                      setExperiences(newExperiences);
                    }} placeholder="Month & Year" />
                    <label>Till</label>
                    <input className="form-control" value={experience.till} onChange={e => {
                      const newExperiences = [...experiences];
                      newExperiences[index].till = e.target.value;
                      setExperiences(newExperiences);
                    }} placeholder="Default: Present" />
                  </div>
                  
                  <label>Details</label>
                  <textarea className="form-control" value={experience.details} onChange={e => {
                    const newExperiences = [...experiences];
                    newExperiences[index].details = e.target.value;
                    setExperiences(newExperiences);
                  }} placeholder="Explain your role"></textarea>
                  
                  <button type="button" className="btn btn-danger" onClick={() => removeExperience(index)}>Remove</button>
              </fieldset>
              ))}
            </fieldset>
            <hr />
            <h5>Education</h5>
            <button type="button" className="btn btn-primary" onClick={addEducation}>Add Education</button>
            {educationFields.map((education, index) => (
              <fieldset key={index} className="form-group">
                <label>Title</label>
                <input className="form-control" value={education.title} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].title = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Your course name?" />
                <div className="form-group">
                  <label>From</label>
                  <input className="form-control" value={education.since} onChange={e => {
                    const newEducationFields = [...educationFields];
                    newEducationFields[index].since = e.target.value;
                    setEducationFields(newEducationFields);
                  }} placeholder="Year admitted in" />
                  <label>Till</label>
                  <input className="form-control" value={education.till} onChange={e => {
                    const newEducationFields = [...educationFields];
                    newEducationFields[index].till = e.target.value;
                    setEducationFields(newEducationFields);
                  }} placeholder="Graduate(d) at" />
                </div>
                <label>Details</label>
                <textarea className="form-control" value={education.details} onChange={e => {
                  const newEducationFields = [...educationFields];
                  newEducationFields[index].details = e.target.value;
                  setEducationFields(newEducationFields);
                }} placeholder="Enter Description"></textarea>
                <button type="button" className="btn btn-danger" onClick={() => removeEducation(index)}>Remove</button>
              </fieldset>
            ))}
            <hr />
            <fieldset className="form-group">
              <h5>Projects</h5>
              <button way-action-push="inputData.projects" className="btn btn-primary">Add project</button>
              <fieldset className="form-group" way-repeat="inputData.projects">
                <label>Title</label><input className="form-control" way-persistent way-data="title" placeholder="Title" />
                <label>URL</label><input className="form-control" way-persistent way-data="url" placeholder="https://github.com/username/project" /> 
                <button way-action-remove="inputData.projects.$$key" way-persistent className="btn btn-danger">Remove</button>
              </fieldset>
            </fieldset>
            <hr />
          </form>
        </div>
        
      </div>
    </>
  );
}

export default CVs;
