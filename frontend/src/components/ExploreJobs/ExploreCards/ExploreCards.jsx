import React, { useState, useEffect } from "react";
import styles from "../ExploreCards/styles.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import userService from "../../../services/userService";

function ExploreCards({ jobs }) {
  const [userNames, setUserNames] = useState({});
  function formatDate(dateString) {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", optionsDate);
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    return `${formattedDate} at ${formattedTime}`;
  }

  useEffect(() => {
    const fetchUserName = async (userId) => {
      const response = await userService.getUserById(userId);
      return response.data.username;
    };
    jobs.forEach(async (job) => {
      if (!userNames[job.postedBy]) {
        const username = await fetchUserName(job.postedBy);
        setUserNames((prevUserNames) => ({
          ...prevUserNames,
          [job.postedBy]: username,
        }));
      }
    });
  }, [jobs]);

  return (
    <div className={styles.container}>
      {jobs.map((job, index) => (
        <div key={index} className={`card my-3 ${styles.card}`}>
          <div className={`card-body ${styles.cardBody}`}>
            <div>
              <h5 className={`card-title ${styles.cardTitle}`}>{job.title}</h5>
              <h6
                className={`card-subtitle mb-2 text-muted ${styles.cardSubtitle}`}
              >
                {job.type}
              </h6>
              <p className={`card-text ${styles.cardText}`}>
                {job.description}
              </p>
              {job.requirements && (
                <div>
                  <h6>Requirements:</h6>
                  <ul className="list-group list-group-flush">
                    {job.requirements.map((requirement, idx) => (
                      <li
                        key={idx}
                        className={`list-group-item ${styles.listGroupItem}`}
                      >
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p>Posted on: {formatDate(job.createdAt)}</p>
              <p>Deadline: {formatDate(job.deadline)}</p>
              <p>Posted by: {userNames[job.postedBy] || "Loading..."}</p>
            </div>
            <a href="#" className={`btn ${styles.btnApply} mt-3`}>
              Apply
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExploreCards;
