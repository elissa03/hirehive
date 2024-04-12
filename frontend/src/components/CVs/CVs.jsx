import React from 'react';
import "../CVs/CV.module.css"; 
function CVs() {
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
              <button way-action-push="inputData.experience" className="btn btn-primary">Add Experience</button>
              <fieldset className="form-group" way-repeat="inputData.experience">
                <label>Title</label>
                <input className="form-control" way-persistent way-data="title" placeholder="Job title" />
                <fieldset className="form-group form-inline">
                  <label>From</label>
                  <input className="form-control" way-persistent way-data="since" placeholder="Some year" />
                  <label>Till</label>
                  <input className="form-control" way-persistent way-data="till" placeholder="Default: Present" />
                </fieldset> 
                <label>Details</label>
                <textarea className="form-control" way-persistent way-data="about" placeholder="Explain your role etc."></textarea>
                <button way-action-remove="inputData.experience.$$key" way-persistent className="btn btn-danger">Remove</button>
              </fieldset>
            </fieldset>
            <hr />
            <h5>Education</h5>
            <button way-action-push="inputData.education" className="btn btn-primary">Add Education</button>
            <fieldset className="form-group" way-repeat="inputData.education">
              <label>Title</label>
              <input className="form-control" way-persistent way-data="title" placeholder="Your course name?" />
              <fieldset className="form-group">
                <label>From</label>
                <input className="form-control" way-persistent way-data="since" placeholder="Year admitted in" />
                <label>Till</label>
                <input className="form-control" way-persistent way-data="till" placeholder="Graduate(d) at" />
              </fieldset> 
              <label>Details</label>
              <textarea className="form-control" way-persistent way-data="about" placeholder="Enter Description"></textarea>
              <button way-action-remove="inputData.education.$$key" way-persistent className="btn btn-danger">Remove</button>
            </fieldset>
            <hr />
            <fieldset className="form-group">
              <h5>Projects</h5>
              <button way-action-push="inputData.projects" className="btn btn-primary">Add project</button>
              <fieldset className="form-group" way-repeat="inputData.projects">
                <label>Title</label><input className="form-control" way-persistent way-data="title" placeholder="Title" />
                <label>URL</label><input className="form-control" way-persistent way-data="url" placeholder="https://github.com/yourname/something" /> 
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
