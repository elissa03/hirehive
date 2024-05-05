import React, { useEffect, useState } from 'react';
import styles from '../CVs/CVs.module.css';
import cvService from '../../services/cvService';
import localStorageUtils from '../../utils/localStorageUtils';

const CVsPanel = ({ onSelect, onClose }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState(null);

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const userId = localStorageUtils.getLocalUserId();
        if (!userId) return;

        const response = await cvService.getAllCvs(userId);
        const fetchedCvs = Object.values(response.data).map(cv => ({
          id: cv._id,
          title: cv.title,
          updatedAt: cv.updatedAt,
        }));

        setCvs(fetchedCvs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching CVs:", error);
        setLoading(false);
      }
    };

    fetchCvs();
  }, []);

  // Function to handle the selection of a CV
  const handleCVClick = (cvId) => {
    setSelectedCV(cvId);
  };

  // Function to confirm the selected CV
  const confirmSelection = () => {
    if (selectedCV) {
      onSelect(selectedCV);
    }
  };

  return (
    <div className={styles.panelWrapper}>
      <div className={styles.panelContent}>
        <div className={styles.cvHeader}>
          <h2>Choose a CV</h2>
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        </div>
        {loading ? (
          <div className={styles.centeredLoader}>
            <div className={styles.loader} />
          </div>
        ) : cvs.length > 0 ? (
          <>
            <div className={styles.cvContainer} style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {cvs.map(cv => (
                <div
                  key={cv.id}
                  className={`${styles.cvBox} ${selectedCV === cv.id ? styles.selectedCV : ''}`}
                  onClick={() => handleCVClick(cv.id)}
                >
                  <div className={styles.cvHeader}>{cv.title}</div>
                  <div className={styles.cvFooter}>{new Date(cv.updatedAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className={styles.panelFooter}>
              <button onClick={confirmSelection} className={styles.okButton} disabled={!selectedCV}>
                OK
              </button>
            </div>
          </>
        ) : (
          <p>You have no existing CVs.</p>
        )}
      </div>
    </div>
  );
};

export default CVsPanel;
