import React, { useState, useEffect } from 'react';
import styles from './CVs.module.css';
import cvService from '../../services/cvService'; 
import cvsUtils from './cvsUtils';
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner'; 
import "react-toastify/dist/ReactToastify.css";
import { FaPlus } from "react-icons/fa";
import localStorageUtils from '../../utils/localStorageUtils';

const CVs = () => { 
  
  const [cvs, setCvs] = useState([]);
  const [editCVId, setEditCVId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // use effect to render the user's cvs by default
  useEffect(() => {
    fetchCvs().then(() => setLoading(false));
  }, []);
 
  // handles closing the context menu which appears when right click is pressed
  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);
    document.addEventListener('click', closeContextMenu);
    return () => {
      document.removeEventListener('click', closeContextMenu);
    };
  }, []);

  // fetches the cvs from backend
  const fetchCvs = async () => { 

    try { 

      const userId = localStorageUtils.getLocalUserId();
      
      if (!userId)
        return;

      const response = await cvService.getAllCvs(userId);
      console.log(Object.values(response.data))
      const cvs = Object.values(response.data); 

      const cvsArray = []
      cvs.forEach(cv => {
        cvsArray.push({id: cv._id, title: cv.title, updatedAt: cv.updatedAt})
      })

      setCvs(cvsArray);

    } catch (error) {
      console.error("There was an error fetching the cvs:", error);
    }
  };
  
  // handles opening the cv 
  const handleCVClick = (cvId) => {
    console.log(`CV with id ${cvId} was clicked`);
    navigate(`/get-cv/${cvId}`)
  };

  // opens the menu to choose what to do with cv
  const handleRightClick = (event, cv) => {
    event.preventDefault();
    setContextMenu({
      cv: cv,
      position: { x: event.pageX, y: event.pageY }
    });
  };

  // edits the title when renaming cv
  const handleTitleChange = (event) => {
    setEditTitle(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await handleUpdateTitle();
    }
  };

  const handleUpdateTitle = async () => { 
    try {
      const userId = localStorageUtils.getLocalUserId();
      if (!userId) return;

      await cvService.updateCv(editCVId, { newData: { title: editTitle }, userId }); 
      setCvs(cvs.map(cv => {
        if (cv.id === editCVId) {
          return { ...cv, title: editTitle };
        }
        return cv;
      }));
      setEditCVId(null);
    } catch (error) {
      console.error('Error updating CV title:', error);
    }
  };

  const handleBlur = async () => { 
    await handleUpdateTitle();
  };

  const handleRename = (cv) => {
    setEditCVId(cv.id);
    setEditTitle(cv.title);
    setContextMenu(null);  
  };

  const handleDelete = async(cv) => {
    try { 

      const userId = localStorageUtils.getLocalUserId();
      
      if (!userId)
        return;

      const response = await cvService.deleteCv(cv.id, userId);
 
      if(response.status === 200) {
        const cvsArray = []
        cvs.forEach(currCv => {
            if (currCv.id !== cv.id)
              cvsArray.push({id: currCv.id, title: currCv.title, updatedAt: currCv.updatedAt})
        })

        setCvs(cvsArray);

        toast.success("CV deleted successfully", {
          position: "top-right",
          autoClose: 2000, // display for 2 seconds 
        });
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
  }

  const ContextMenu = ({ position, onRename, onDelete }) => {
    return (
      <ul className={styles.contextMenu} style={{ top: position.y, left: position.x }}>
        <li onClick={onRename}>Rename</li>
        <li onClick={() => console.log('Edit clicked')}>Edit</li>
        <li onClick={onDelete}>Delete</li>
      </ul>
    );
  };

  return (
    <div className={styles.wrapper}>
      <h2>CVs</h2>
      <ToastContainer />
      {loading ? (
        <div className={styles.centeredLoader}>   
          <TailSpin
            color="#fbf07de1"
            height={70}
            width={70}
          />
        </div> // loading indicator
      ) : cvs.length > 0 ? (
        <div className={styles.cvContainer}> 
          {cvs.map(cv => (
            <div
              key={cv.id}
              className={styles.cvBox}
              style={{ position: 'relative' }}  
              onClick={() => handleCVClick(cv.id)}
              onContextMenu={(e) => handleRightClick(e, cv)}
            >
              <div className={styles.cvHeader}> 
                {/* stop propagation in order to stop it from firing get-cv */}
                <span className={styles.dots} onClick={(e) => {e.stopPropagation(); handleRightClick(e, cv)}}>&#x22EE;</span>  
                {editCVId === cv.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={handleTitleChange}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    className={styles.editInput}
                  />
                ) : (
                  cv.title
                )}
              </div>
              <div className={styles.cvContent}><br></br></div>
              <div className={styles.cvFooter}>
                {cvsUtils.formatUpdatedAt(cv.updatedAt)}
              </div>
            </div>
          ))}

          {contextMenu && (
            <ContextMenu
              position={contextMenu.position}
              onRename={() => handleRename(contextMenu.cv)}
              onDelete={() => handleDelete(contextMenu.cv)}
            />
          )}
        </div>
      ) : (
        <p>You have not created any CVs yet.</p>
      )}
      
      <div className="d-flex justify-content-center col-12 mb-4">
        <button
          className={`btn fab ${styles.bottomRightButton}`} 
          onClick={() => navigate('/create-cv')}
        >
          <FaPlus />
        </button> 
      </div>
    </div>
  );
  
};

export default CVs;
