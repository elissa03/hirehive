// import React from 'react';
// import styles from './IndividualCV.module.css';  
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';  
// import logo from '/images/logo.png';  
// import { useNavigate } from 'react-router-dom';

// const IndividualCV = () => {
//   const navigate = useNavigate();   
//   const goBack = () => {
//     navigate(-1);
//   };

//   return (
//     <>
//       <div className={styles.top}><div className={styles.backButton} onClick={goBack}>
//           <FontAwesomeIcon icon={faArrowLeft} /> {/* Back arrow icon */}
//         </div>
//         <div className={styles.logoSection} onClick={()=> window.location.reload()}>
//           <img src={logo} alt="Company Logo" className={styles.logo} />
//         </div></div>

//       <div className={styles.container}>
//         <div className={styles.cvContent}>
//           <div className={styles.heading}>
//             <h1>FIRSTNAME LASTNAME</h1>
//             <p className={styles.text}>+1(123) 456-7890 • San Francisco, CA</p>
//             <p className={styles.text}>
//               contact@faangpath.com • linkedin.com/company/faangpath • www.faangpath.com
//             </p>
//           </div>
//           <hr className={styles.separator} /> 

//           <h2 className={styles.sectionTitle}>EDUCATION</h2>
//           <div>
//             <div className={styles.titleRow}>
//               <p className={styles.title}>Master of Computer Science, Stanford University</p>
//               <p className={styles.date}>Expected 2020</p>
//             </div>
//             <p className={styles.text}>Relevant Coursework: A, B, C, and D.</p>

//             <div className={styles.titleRow}>
//               <p className={styles.title}>Bachelor of Computer Science, Stanford University</p>
//               <p className={styles.date}>2014 - 2017</p>
//             </div>
//           </div>

          
//           <hr className={styles.separator} /> 

//           <h2 className={styles.sectionTitle}>SKILLS</h2>
//           <div className="grid grid-cols-2 gap-4 mt-2">
//             <div>
//               <p className={`${styles.text} font-semibold`}>Technical Skills: </p>
//               <p className={styles.text}>A, B, C, D</p>
//             </div>
//             <div>
//               <p className={`${styles.text} font-semibold`}>Soft Skills: </p>
//               <p className={styles.text}>A, B, C, D</p>
//             </div>
//             <div className="col-span-2">
//               <p className={`${styles.text} font-semibold`}>Languages: </p>
//               <p className={styles.text}>A, B, C, D</p>
//             </div>
//           </div>

//           <hr className={styles.separator} /> 

//           <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
//           <div>
//             <div className={styles.titleRow}>
//               <p className={styles.title}>Role Name</p>
//               <p className={styles.date}>Jan 2017 - Jan 2019</p>
//             </div>
//             <p className={styles.text}>Company Name</p>
//             <p className={styles.text}>San Francisco, CA</p>
//             <ul className={`${styles.list} list-disc`}>
//               <li className={styles.listItem}>Achieved X% growth for XYZ using A, B, and C skills.</li>
//               <li className={styles.listItem}>Led XYZ which led to X% improvement in ABC.</li>
//               <li className={styles.listItem}>Developed XYZ that did A, B, and C using X, Y, and Z.</li>
//             </ul>
//           </div>

          
//           <hr className={styles.separator} /> 

//           <h2 className={styles.sectionTitle}>PROJECTS</h2>
//           <div className="mt-2">
//             <p className={`${styles.text} font-semibold`}>Hiring Search Tool</p>
//             <p className={styles.text}>
//               Built a tool to search for Hiring Managers and Recruiters by using ReactJS, NodeJS,
//               Firebase, and boolean queries. Over 25000 people have used it so far, with 5000+ queries
//               saved and shared, and search results even better than LinkedIn!
//             </p>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default IndividualCV;
import React from 'react';
import styles from './IndividualCV.module.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';  
import logo from '/images/logo.png';  
import { useNavigate } from 'react-router-dom';

const IndividualCV = () => {
  const navigate = useNavigate();   
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className={styles.top}>
        <div className={styles.backButton} onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> {/* Back arrow icon */}
        </div>
        <div className={styles.logoSection} onClick={() => window.location.reload()}>
          <img src={logo} alt="Company Logo" className={styles.logo} />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.cvContent}>
          <div className={styles.heading}>
            <h1>FIRSTNAME LASTNAME</h1>
            <p className={styles.text}>+1(123) 456-7890 • San Francisco, CA</p>
            <p className={styles.text}>
              contact@faangpath.com • linkedin.com/company/faangpath • www.faangpath.com
            </p>
          </div>
          <hr className={styles.separator} /> 

          <h2 className={styles.sectionTitle}>EDUCATION</h2>
          <div>
            <div className={styles.titleRow}>
              <p className={styles.title}>Master of Computer Science, Stanford University</p>
              <p className={styles.date}>Expected 2020</p>
            </div>
            <p className={styles.text}>Relevant Coursework: A, B, C, and D.</p>

            <div className={styles.titleRow}>
              <p className={styles.title}>Bachelor of Computer Science, Stanford University</p>
              <p className={styles.date}>2014 - 2017</p>
            </div>
          </div>

          <hr className={styles.separator} /> 

          <h2 className={styles.sectionTitle}>SKILLS</h2>
          <div>
            <div className={styles.skillRow}>
              <p className={styles.title}>Technical Skills:</p>
              <p className={styles.text}>A, B, C, D</p>
            </div>
            <div className={styles.skillRow}>
              <p className={styles.title}>Soft Skills:</p>
              <p className={styles.text}>A, B, C, D</p>
            </div>
            <div className={styles.skillRow}>
              <p className={styles.title}>Languages:</p>
              <p className={styles.text}>
                English <span className={styles.proficiency}>(Native)</span>, French <span className={styles.proficiency}>(Fluent)</span>
              </p>
            </div>
          </div>

          <hr className={styles.separator} /> 

          <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
          <div>
            <div className={styles.titleRow}>
              <p className={styles.title}>Role Name</p>
              <p className={styles.date}>Jan 2017 - Jan 2019</p>
            </div>
            <p className={styles.text}>Company Name</p>
            <p className={styles.text}>San Francisco, CA</p>
            <ul className={`${styles.list} list-disc`}>
              <li className={styles.listItem}>Achieved X% growth for XYZ using A, B, and C skills.</li>
              <li className={styles.listItem}>Led XYZ which led to X% improvement in ABC.</li>
              <li className={styles.listItem}>Developed XYZ that did A, B, and C using X, Y, and Z.</li>
            </ul>
          </div>

          <hr className={styles.separator} /> 

          <h2 className={styles.sectionTitle}>PROJECTS</h2>
          <div className="mt-2">
            <p className={`${styles.text} font-semibold`}>Hiring Search Tool</p>
            <p className={styles.text}>
              Built a tool to search for Hiring Managers and Recruiters by using ReactJS, NodeJS,
              Firebase, and boolean queries. Over 25000 people have used it so far, with 5000+ queries
              saved and shared, and search results even better than LinkedIn!
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default IndividualCV;
